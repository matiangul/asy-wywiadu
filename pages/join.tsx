import * as Sentry from '@sentry/browser';
import ControlContent from '../src/components/control.content';
import ControlFooter from '../src/components/control.footer';
import ControlHeader from '../src/components/control.header';
import ControlMain from '../src/components/control.main';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TeamColor } from '../src/model/color';
import { Game, hasLeader } from '../src/model/game';
import { isGuesser, isLeader, Player, Role } from '../src/model/player';
import { addGamePlayer, loadGame, loadPlayer, watchGame } from '../src/store/repository';
import LeaderIcon from '../src/components/leader.icon';
import GuesserIcon from '../src/components/guesser.icon';

export default () => {
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
        <ControlMain title="Hej Asie" subtitle="Tutaj możesz dołączyć do istniejącej gry">
          <div className="grid grid-cols-3 grid-rows-1 gap-4 grid-flow-row-dense">
            <form className="col-span-2">
              <label className="block">
                <span className="text-gray-700">Nazwa rozgrywki</span>
                <input
                  type="text"
                  name="gameName"
                  className="form-input mt-1 block w-full"
                  placeholder="abc-def-123-456"
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
                      className="form-input mt-1 block w-full"
                      placeholder="złowrogi ogr"
                      value={player.nick}
                      onChange={(e) => {
                        const nick = e.target.value;
                        setPlayer((player) => ({ ...player, nick }));
                      }}
                    />
                  </label>
                  <div className="mt-2">
                    <span className="tex-2xl">Wybierz drużynę</span>
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
                    <span className="tex-2xl">Wybierz swoją rolę w drużynie</span>
                    <div className="mt-2">
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="playerRole"
                            className="form-radio text-pink-500"
                            value="guesser"
                            checked={player.role === 'guesser'}
                            onChange={(e) => {
                              const role = e.target.value;
                              setPlayer((player) => ({ ...player, role: role as Role }));
                            }}
                          />
                          <span className="ml-2">Zgadywacz</span>
                        </label>
                      </div>
                      {!hasLeader(game, player.color) && (
                        <div>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="playerRole"
                              className="form-radio text-pink-500"
                              value="leader"
                              checked={player.role === 'leader'}
                              onChange={(e) => {
                                const role = e.target.value;
                                setPlayer((player) => ({ ...player, role: role as Role }));
                              }}
                            />
                            <span className="ml-2">Lider</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  {player.nick && player.color && player.role && (
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
                        Dołącz jako {isLeader(player) ? 'lider' : 'zgadywacz'}{' '}
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
              {game === undefined && <p>Momencik, już szukam tej gry w internetach...</p>}
              {game === null && <p>Nie ma takiej gry, sory :(</p>}
            </form>
            <div className="text-gray-700 p-2">
              {game &&
                game.players.map((p) => (
                  <p className="truncate" key={p.nick}>
                    {isGuesser(p) && <GuesserIcon color={p.color} />}
                    {isLeader(p) && <LeaderIcon color={p.color} />}
                    <span className="ml-1 align-middle">{p.nick}</span>
                  </p>
                ))}
            </div>
          </div>
        </ControlMain>
        <ControlFooter />
      </ControlContent>
    </>
  );
};
