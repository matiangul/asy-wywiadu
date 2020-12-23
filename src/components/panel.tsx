import React, { useState } from 'react';
import { oppositeTeamColor } from '../model/color';
import {
  allTeamCards,
  Game,
  groupedPlayers,
  isPlayersRound,
  remainingTeamCardsCount,
  roundsColor,
  setRoundsPassword,
  teamsPreviousPasswords,
  voteForRoundEnd
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

  const previousPasswords = teamsPreviousPasswords(game, player.color);

  return (
    <div className={className}>
      <div className="flex items-baseline space-x-2">
        <button
          onClick={() => setActiveTab('players')}
          className={`text-white hover:bg-gray-800 ${
            activeTab === 'players' ? 'bg-gray-600' : 'bg-gray-400'
          } px-3 py-2 rounded-md text-sm font-medium`}
        >
          Gracze
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`text-white hover:bg-gray-800 ${
            activeTab === 'info' ? 'bg-gray-600' : 'bg-gray-400'
          } px-3 py-2 rounded-md text-sm font-medium`}
        >
          Informacje
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
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 grid-flow-row-dense">
          {isLeader(player) &&
            isPlayersRound(game, player) &&
            game.roundsPassword[game.round].length === 0 && (
              <div className="sm:col-span-2 md:col-span-4">
                <label className="block">
                  <span className="text-gray-700">Wpisz hasło dla swojej drużyny:</span>
                  <input
                    type="text"
                    name="password"
                    className="w-full form-input mt-1 block"
                    placeholder={game.roundsPassword[game.round] || 'Narzędzie 3'}
                    disabled={game.roundsPassword[game.round].length > 0}
                    value={password}
                    onChange={(e) => {
                      const password = e.target.value;
                      setPassword(password);
                    }}
                  />
                </label>
                <button
                  type="button"
                  className={`w-full mt-2 bg-${player.color} text-white py-2 px-4 border-b-4 border-${player.color} hover:bg-opacity-75 rounded`}
                  disabled={game.roundsPassword[game.round].length > 0}
                  onClick={() =>
                    updateGame(game.name, (remoteGame) => setRoundsPassword(remoteGame, password))
                  }
                >
                  Zatwierdź hasło
                </button>
              </div>
            )}

          <div>
            <span className="font-bold">{player.nick}</span> jesteś{' '}
            <span>{isGuesser(player) ? ' zgadywaczem ' : ' liderem '}</span>
            {isLeader(player) ? (
              <LeaderIcon color={player.color} />
            ) : (
              <GuesserIcon color={player.color} />
            )}{' '}
            w drużynie {player.color === 'red' ? ' czerwonej' : ' niebieskiej'}
          </div>

          <div>
            <span className="font-bold">
              {isPlayersRound(game, player) ? 'Wasza ' : 'Ich '} kolej
            </span>
            . Zostało {isPlayersRound(game, player) ? ' wam ' : ' im '}{' '}
            <span className="font-bold">
              {remainingTeamCardsCount(game, roundsColor(game))}/
              {allTeamCards(game, roundsColor(game)).length}
            </span>
          </div>

          <div>
            {isPlayersRound(game, player) ? ' Przeciwnej ' : ' Waszej '}
            {' drużynie zostało '}
            <span className="font-bold">
              {remainingTeamCardsCount(game, oppositeTeamColor(roundsColor(game)))}/
              {allTeamCards(game, oppositeTeamColor(roundsColor(game))).length}
            </span>
          </div>

          <div>
            {isPlayersRound(game, player) ? 'Wasze ' : 'Ich '}
            hasło to: <span className="font-bold">"{game.roundsPassword[game.round]}"</span>
          </div>

          <div className="sm:col-span-2 md:col-span-4">
            Wasze poprzednie hasła:{' '}
            {previousPasswords.length > 0 &&
              teamsPreviousPasswords(game, player.color)
                .map((text) => `"${text}"`)
                .join(', ')}
            {previousPasswords.length === 0 && '...'}
          </div>

          {isGuesser(player) && isPlayersRound(game, player) && (
            <div className="sm:col-span-2 md:col-span-4">
              <button
                type="button"
                className={`w-full bg-${player.color} text-white py-2 px-4 border-b-4 border-${player.color} hover:bg-opacity-75 rounded`}
                onClick={() => {
                  updateGame(game.name, (remoteGame) => voteForRoundEnd(remoteGame, player));
                }}
              >
                Koniec rundy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Panel;
