import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Board from '../../src/components/board';
import ControlFooter from '../../src/components/control.footer';
import ControlHeader from '../../src/components/control.header';
import FabIcon from '../../src/components/fab.icon';
import GuesserIcon from '../../src/components/guesser.icon';
import LeaderIcon from '../../src/components/leader.icon';
import { oppositeTeamColor } from '../../src/model/color';
import {
  allTeamCards,
  Game,
  groupedPlayers,
  isBombCardSelected,
  isPlayerInTheGame,
  isPlayersRound,
  remainingTeamCardsCount,
  selectedTeamCards,
  setRoundsPassword,
  voteForRoundEnd,
} from '../../src/model/game';
import { isGuesser, isLeader, Player } from '../../src/model/player';
import { loadGame, loadPlayer, updateGame, watchGame } from '../../src/store/repository';

type Tab = 'players' | 'info';

const GamePage = () => {
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
  const [activeTab, setActiveTab] = useState<Tab>('info');

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
    <div className="relative bg-beige font-serif p-8 min-h-screen">
      <ControlHeader title={game.name} />
      <Board player={player} game={game} />
      <div className="hidden lg:block w-full bg-gray-100 rounded-md shadow-md text-gray-600 p-4 mt-8">
        <div className="flex items-baseline space-x-2">
          <button
            onClick={() => setActiveTab('players')}
            className={`text-white hover:bg-gray-800 ${
              activeTab === 'players' ? 'bg-gray-600' : 'bg-gray-400'
            } px-3 py-2 rounded-md text-sm font-medium`}
          >
            Players
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`text-white hover:bg-gray-800 ${
              activeTab === 'info' ? 'bg-gray-600' : 'bg-gray-400'
            } px-3 py-2 rounded-md text-sm font-medium`}
          >
            Info
          </button>
        </div>

        {activeTab === 'players' && (
          <div className="mt-4">
            {groupedPlayers(game).map((player) => (
              <p className="truncate" key={player.nick}>
                {isGuesser(player) && <GuesserIcon color={player.color} />}
                {isLeader(player) && <LeaderIcon color={player.color} />}
                <span className="ml-1 align-middle">{player.nick}</span>
              </p>
            ))}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="mt-4">
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
              drużynę. Zostało {isPlayersRound(game, player) ? ' wam ' : ' im '} do odgadnięcia{' '}
              {remainingTeamCardsCount(game, player.color)} z{' '}
              {allTeamCards(game, player.color).length} kart
            </p>
            <p>
              {isPlayersRound(game, player) ? 'Wasze ' : 'Ich '}
              hasło to: "{game.roundsPassword[game.round]}"
            </p>
          </div>
        )}
      </div>
      <button
        onClick={() => setTooltipVisibility(!isTooltipOpen)}
        className="fixed right-0 bottom-0 mr-2 mb-2 z-10 lg:hidden w-12 h-12 bg-blue rounded-full text-white flex items-center justify-center focus:outline-none focus:shadow-outline"
      >
        <FabIcon />
      </button>
      {isTooltipOpen && (
        <button
          onClick={() => setTooltipVisibility(false)}
          tabIndex={-1}
          className="fixed lg:hidden inset-0 h-full w-full bg-black opacity-50 cursor-default"
        ></button>
      )}
      {isTooltipOpen && (
        <div className="fixed lg:hidden w-5/6 bottom-0 right-0 mb-10 mr-12 rounded-md bg-gray-600 text-white p-2">
          <div className="flex items-baseline space-x-2">
          <button
            onClick={() => setActiveTab('players')}
            className={`text-white hover:bg-gray-800 ${
              activeTab === 'players' ? 'bg-gray-600' : 'bg-gray-400'
            } px-3 py-2 rounded-md text-sm font-medium`}
          >
            Players
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`text-white hover:bg-gray-800 ${
              activeTab === 'info' ? 'bg-gray-600' : 'bg-gray-400'
            } px-3 py-2 rounded-md text-sm font-medium`}
          >
            Info
          </button>
        </div>

        {activeTab === 'players' && (
          <div className="mt-4">
            {groupedPlayers(game).map((player) => (
              <p className="truncate" key={player.nick}>
                {isGuesser(player) && <GuesserIcon color={player.color} />}
                {isLeader(player) && <LeaderIcon color={player.color} />}
                <span className="ml-1 align-middle">{player.nick}</span>
              </p>
            ))}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="mt-4">
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
              drużynę. Zostało {isPlayersRound(game, player) ? ' wam ' : ' im '} do odgadnięcia{' '}
              {remainingTeamCardsCount(game, player.color)} z{' '}
              {allTeamCards(game, player.color).length} kart
            </p>
            <p>
              {isPlayersRound(game, player) ? 'Wasze ' : 'Ich '}
              hasło to: "{game.roundsPassword[game.round]}"
            </p>
          </div>
        )}
        </div>
      )}
      <ControlFooter />
    </div>
  );
};

export default GamePage;
