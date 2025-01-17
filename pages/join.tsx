import * as Sentry from '@sentry/browser';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ControlContent from '../src/components/control.content';
import ControlFooter from '../src/components/control.footer';
import ControlHeader from '../src/components/control.header';
import ControlMain from '../src/components/control.main';
import GuesserIcon from '../src/components/guesser.icon';
import LeaderIcon from '../src/components/leader.icon';
import InstructionLink from '../src/components/instruction.link';
import { TeamColor } from '../src/model/color';
import { Game, groupedPlayers, hasLeader } from '../src/model/game';
import { isGuesser, isLeader, Player, Role } from '../src/model/player';
import { addGamePlayer, loadGame, loadPlayer, watchGame } from '../src/store/repository';

const JoinPage = () => {
  const router = useRouter();

  const [gameName, choseGameName] = useState('');
  useEffect(() => choseGameName((router.query.name as string) || ''), [router.query.name]);

  const [game, setGame] = useState<Game>(undefined);
  useEffect(() => {
    if (!gameName) {
      return;
    }
    loadGame(gameName)
      .then(setGame)
      .then(() => watchGame(gameName, setGame));
    // undefined when not found
  }, [gameName]);

  const defaultPlayerSettings = {
    nick: '',
    color: 'red' as TeamColor,
    role: 'guesser' as Role,
    active: true,
  };
  const [player, setPlayer] = useState<Player>(defaultPlayerSettings);
  useEffect(() => {
    if (!game) {
      return;
    }
    loadPlayer(game).then((gamePlayer) => {
      if (gamePlayer) {
        router.push(`/game/${game.name}`);
      }
    });
  }, [game]);

  return (
    <>
      <ControlHeader title="Asy wywiadu - dołącz do gry" />

      <ControlContent>
        <ControlMain title="Hej Asie" subtitle="Tutaj możesz dołączyć do trwającej sprawy">
          <div className="grid grid-cols-2 grid-rows-1 gap-4 grid-flow-row-dense">
            <form>
              <label className="block">
                <span className="text-gray-700">Nazwa sprawy</span>
                <input
                  type="text"
                  name="gameName"
                  className="form-input mt-1 block w-full placeholder-gray-200 border-2 rounded-md"
                  placeholder="abc-def-123-456"
                  autoFocus
                  disabled={!!router.query.name}
                  value={gameName}
                  onChange={(e) => {
                    const name = e.target.value;
                    choseGameName(name);
                  }}
                />
              </label>
              {game && (
                <>
                  <label className="block mt-2">
                    <span className="text-gray-700">Jak się zwiesz?</span>
                    <input
                      type="text"
                      name="playerNick"
                      className="form-input mt-1 block w-full placeholder-gray-200 border-2 rounded-md"
                      placeholder="np. złowrogi ogr"
                      autoFocus
                      value={player.nick}
                      onChange={(e) => {
                        const nick = e.target.value;
                        setPlayer((player) => ({ ...player, nick }));
                      }}
                    />
                  </label>
                  <div className="mt-2">
                    <span className="tex-2xl">Wybierz zespół</span>
                    <div className="mt-2">
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="playerColor"
                            className="form-radio text-blue"
                            value="blue"
                            checked={player.color === 'blue'}
                            onChange={(e) => {
                              const color = e.target.value;
                              setPlayer((player) => ({
                                ...player,
                                color: color as TeamColor,
                              }));
                            }}
                          />
                          <span className="ml-2">Niebiescy</span>
                        </label>
                      </div>
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="playerColor"
                            className="form-radio text-red"
                            value="red"
                            checked={player.color === 'red'}
                            onChange={(e) => {
                              const color = e.target.value;
                              setPlayer((player) => ({
                                ...player,
                                color: color as TeamColor,
                              }));
                            }}
                          />
                          <span className="ml-2">Czerwoni</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="tex-2xl">Wybierz swoją rolę w zespole</span>
                    <div className="mt-2">
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="playerRole"
                            className={`form-radio text-${player.color}`}
                            value="guesser"
                            checked={player.role === 'guesser'}
                            onChange={(e) => {
                              const role = e.target.value;
                              setPlayer((player) => ({ ...player, role: role as Role }));
                            }}
                          />
                          <span className="ml-2 align-middle">Detektyw</span>&nbsp;&nbsp;
                          <GuesserIcon color={player.color} />
                        </label>
                      </div>
                      {!hasLeader(game, player.color) && (
                        <div>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="playerRole"
                              className={`form-radio text-${player.color}`}
                              value="leader"
                              checked={player.role === 'leader'}
                              onChange={(e) => {
                                const role = e.target.value;
                                setPlayer((player) => ({ ...player, role: role as Role }));
                              }}
                            />
                            <span className="ml-2 align-middle">Szpieg</span>&nbsp;&nbsp;
                            <LeaderIcon color={player.color} />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  {player.nick &&
                    player.color &&
                    (player.role === 'guesser' || !hasLeader(game, player.color)) && (
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          addGamePlayer(player, game)
                            .then(() => router.push(`/game/${gameName}`))
                            .catch((err) => {
                              Sentry.captureException(err);
                              alert(err.message);
                            });
                        }}
                        className={`mt-2 w-full bg-${player.color} text-white py-2 px-4 border-b-4 border-${player.color} hover:bg-opacity-75 rounded`}
                      >
                        <span className="ml-1 align-middle">
                          Dołącz jako {isLeader(player) ? 'szpieg' : 'detektyw'}{' '}
                        </span>
                        {isLeader(player) ? (
                          <LeaderIcon color="white" />
                        ) : (
                          <GuesserIcon color="white" />
                        )}
                      </button>
                    )}
                </>
              )}
              {game === undefined && gameName.length > 0 && (
                <p>Momencik, już szukam tej sprawy...</p>
              )}
              {game === null && gameName.length > 0 && <p>Nie ma takiej sprawy, sory :(</p>}
            </form>
            <div className="text-gray-700">
              <p className="mb-2">Gracze, którzy już dołączyli do tej sprawy</p>
              {game && groupedPlayers(game).length === 0 && <p>...</p>}
              {game &&
                groupedPlayers(game).map((p) => (
                  <p className="truncate" key={p.nick}>
                    {isGuesser(p) && <GuesserIcon color={p.color} />}
                    {isLeader(p) && <LeaderIcon color={p.color} />}
                    <span className="ml-1 align-middle">{p.nick}</span>
                  </p>
                ))}
            </div>
            <InstructionLink />
          </div>
        </ControlMain>
        <ControlFooter />
      </ControlContent>
    </>
  );
};

export default JoinPage;
