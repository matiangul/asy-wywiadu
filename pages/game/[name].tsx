import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Board from '../../src/components/board';
import { oppositeTeamColor } from '../../src/model/color';
import {
  allTeamCards,
  Game,
  isBombCardSelected,
  isPlayerInTheGame,
  isPlayersRound,
  selectedTeamCards,
  setRoundsPassword,
  voteForRoundEnd,
} from '../../src/model/game';
import { isGuesser, isLeader, Player } from '../../src/model/player';
import { loadGame, loadPlayer, updateGame, watchGame } from '../../src/store/repository';

export default () => {
  const router = useRouter();
  const { name } = router.query;

  const [game, setGame] = useState<Game | null | undefined>(undefined);
  useEffect(() => {
    if (!name) {
      return;
    }
    loadGame(name as string)
      .then(setGame)
      .then(() => watchGame(name as string, setGame));
  }, [name]);

  const [player, setPlayer] = useState<Player | null | undefined>(undefined);
  useEffect(() => {
    if (!game) {
      return;
    }
    loadPlayer(game).then(setPlayer);
  }, [game]);

  const [password, setPassword] = useState<string>('');
  const [isTooltipOpen, setTooltipVisibility] = useState<boolean>(false);

  if (game === undefined) {
    return <p>Momencik, już szukam tej gry w internetach...</p>;
  }

  if (player === undefined) {
    return <p>Już już, daj mi tylko sprawdzić ktoś ty jest...</p>;
  }

  if (game === null) {
    return <p>Nic nie wiem o tej grze :(</p>;
  }

  if (player === null || !isPlayerInTheGame(game, player)) {
    return <p>Ktoś ty?</p>;
  }

  if (isBombCardSelected(game)) {
    return !isPlayersRound(game, player) ? (
      <>
        <p>Jesteś zwycięzcą!</p>
        <p>Przeciwna drużyna zaznaczyła czarną kartę.</p>
      </>
    ) : (
      <>
        <p>Przegraliście :(</p>
        <p>Niestety twoja drużyna zaznaczyła czarną kartę.</p>
      </>
    );
  }

  if (selectedTeamCards(game, player.color).length === allTeamCards(game, player.color).length) {
    return (
      <>
        <p>Jesteś zwycięzcą!</p>
        <p>Twoja drużyna ma już wszystkie wasze hasła.</p>
      </>
    );
  }

  if (
    selectedTeamCards(game, oppositeTeamColor(player.color)).length ===
    allTeamCards(game, oppositeTeamColor(player.color)).length
  ) {
    return (
      <>
        <p>Przegraliście :(</p>
        <p>Niestety przeciwna drużyna ma już wszystkie swoje hasła.</p>
      </>
    );
  }

  return (
    <div className="relative">
      <div className="flex gap-2 p-16">
        <Board player={player} game={game} />
        <div className="hidden lg:block w-1/4 bg-gray-100 rounded-sm shadow-sm text-gray-600 p-2">
          {game.players.map((player) => (
            <p className="truncate">
              {isGuesser(player) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`text-${player.color} w-4 h-4 inline`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
              {isLeader(player) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`text-${player.color} w-4 h-4 inline`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              )}
              <span className="ml-1 align-middle">{player.nick}</span>
            </p>
          ))}
        </div>
        <button
          onClick={() => setTooltipVisibility(!isTooltipOpen)}
          className="fixed right-0 bottom-0 mr-2 mb-2 z-10 lg:hidden w-12 h-12 bg-blue rounded-full text-white flex items-center justify-center focus:outline-none focus:shadow-outline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="flex-shrink-0 w-10 h-10 mt-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        </button>
        {isTooltipOpen && (
          <button
            onClick={() => setTooltipVisibility(false)}
            tabIndex={-1}
            className="fixed inset-0 h-full w-full bg-black opacity-50 cursor-default"
          ></button>
        )}
        {isTooltipOpen && (
          <div className="fixed w-5/6 bottom-0 right-0 mb-10 mr-12 rounded-md bg-gray-600 text-white p-2">
            {game.players.map((player) => (
              <p className="truncate">
                {isGuesser(player) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className={`text-${player.color} w-4 h-4 inline`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
                {isLeader(player) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className={`text-${player.color} w-4 h-4 inline`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                )}
                <span className="ml-1 align-middle">{player.nick}</span>
              </p>
            ))}
          </div>
        )}
      </div>
      {isLeader(player) && isPlayersRound(game, player) && (
        <>
          <p>Wpisz hasło dla swojej drużyny:</p>
          <input
            type="text"
            name="password"
            placeholder={game.roundsPassword[game.round] || 'Narzędzie 3'}
            disabled={game.roundsPassword[game.round].length > 0}
            value={password}
            onChange={(e) => {
              const password = e.target.value;
              setPassword(password);
            }}
          />
          <button
            type="button"
            disabled={game.roundsPassword[game.round].length > 0}
            onClick={() =>
              updateGame(game.name, (remoteGame) => setRoundsPassword(remoteGame, password))
            }
          >
            Zatwierdź hasło
          </button>
        </>
      )}
      {isGuesser(player) && isPlayersRound(game, player) && (
        <button
          type="button"
          onClick={() => {
            updateGame(game.name, (remoteGame) => voteForRoundEnd(remoteGame, player));
          }}
        >
          Koniec rundy
        </button>
      )}
      <p>
        {player.nick} jesteś
        {isGuesser(player) ? ' zgadywaczem ' : ' liderem '}w drużynie
        {player.color === 'red' ? ' czerwonej.' : ' niebieskiej.'}
      </p>
      <p>
        Kolej na
        {isPlayersRound(game, player) ? ' twoją ' : ' drugą '}
        drużynę
      </p>
      <p>
        {isPlayersRound(game, player) ? 'Wasze ' : 'Ich '}
        hasło to: "{game.roundsPassword[game.round]}"
      </p>
    </div>
  );
};
