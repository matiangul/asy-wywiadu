import React, { useState } from 'react';
import {
  allTeamCards,
  Game,
  groupedPlayers,
  isPlayersRound,
  remainingTeamCardsCount,
  setRoundsPassword,
  voteForRoundEnd,
} from '../model/game';
import { isGuesser, isLeader, Player } from '../model/player';
import { updateGame } from '../store/repository';
import GuesserIcon from './guesser.icon';
import LeaderIcon from './leader.icon';

type Tab = 'players' | 'info';

type Props = {
  className: string;
  game: Game;
  player: Player;
};

const Panel = ({ className, game, player }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [password, setPassword] = useState<string>('');

  return (
    <div className={className}>
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
  );
};

export default Panel;
