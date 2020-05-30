import * as Sentry from "@sentry/browser";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { component, global } from "../src/components/styles/welcome";
import { TeamColor } from "../src/model/color";
import { Player, Role } from "../src/model/player";
import {
  addGamePlayer,
  loadGame,
  loadPlayer,
  watchGame,
} from "../src/store/repository";

export default () => {
  const router = useRouter();

  const [gameName, choseGameName] = useState("");
  useEffect(() => choseGameName((router.query.name as string) || ""), [
    router.query.name,
  ]);

  const [game, setGame] = useState(undefined);
  useEffect(() => {
    if (!gameName) {
      return;
    }
    loadGame(gameName)
      .then(setGame)
      .then(() => watchGame(gameName, setGame));
  }, [gameName]);

  const defaultPlayerSettings = {
    nick: "",
    color: "red" as TeamColor,
    role: "guesser" as Role,
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
    <div className="container">
      <Head>
        <title>Asy wywiadu - dołącz do gry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Hej Asie</h1>
        <p className="description">Tutaj możesz dołączyć do istniejącej gry</p>
        <form>
          <input
            type="text"
            name="gameName"
            placeholder="Nazwa rozgrywki"
            value={gameName}
            onChange={(e) => {
              const name = e.target.value;
              choseGameName(name);
            }}
          />
          {game && (
            <>
              <p>Jak się zwiesz?</p>
              <input
                type="text"
                name="playerNick"
                placeholder="nick"
                value={player.nick}
                onChange={(e) => {
                  const nick = e.target.value;
                  setPlayer((player) => ({ ...player, nick }));
                }}
              />
              <p>Wybierz drużynę</p>
              <select
                name="playerColor"
                value={player.color}
                onChange={(e) => {
                  const color = e.target.value;
                  setPlayer((player) => ({
                    ...player,
                    color: color as TeamColor,
                  }));
                }}
              >
                <option value="red">Czerwoni</option>
                <option value="blue">Niebiescy</option>
              </select>
              <p>Wybierz swoją rolę w drużynie</p>
              <select
                name="playerRole"
                value={player.role}
                onChange={(e) => {
                  const role = e.target.value;
                  setPlayer((player) => ({ ...player, role: role as Role }));
                }}
              >
                <option value="leader">Lider</option>
                <option value="guesser">Zgadywacz</option>
              </select>

              {player.nick && player.color && player.role && (
                <>
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
                  >
                    Dołącz
                  </button>
                </>
              )}
            </>
          )}
          {game === undefined && (
            <p>Momencik, już szukam tej gry w internetach...</p>
          )}
          {game === null && <p>Nie ma takiej gry, sory :(</p>}
        </form>
      </main>

      <footer>
        <a href="https://angulski.pl" target="_blank" rel="noopener noreferrer">
          Autor Mateusz Angulski
        </a>
      </footer>

      {component}
      {global}
    </div>
  );
};
