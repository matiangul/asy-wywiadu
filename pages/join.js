import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { component, global } from "../src/navigation/styles";
import { loadGame, loadPlayer, updateGame, updatePlayer } from "../src/store";
import { addPlayer } from "../src/game";

const Join = () => {
  const router = useRouter();
  // game name
  const [gameName, choseGameName] = useState("");
  useEffect(() => choseGameName(router.query.name || ""), [router.query.name]);
  // game player
  const [player, setPlayer] = useState({
    nick: "",
    color: "red",
    role: "guesser",
  });
  useEffect(() => {
    if (gameName) {
      loadPlayer(gameName).then((storedPlayer) => {
        if (storedPlayer) {
          router.push(`/game/${gameName}`);
        }
      });
    }
  }, [gameName]);
  // game state
  const [game, setGame] = useState(null);
  useEffect(() => {
    if (gameName) {
      loadGame(gameName).then(setGame);
    }
  }, [gameName]);

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
          {game ? (
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
                  setPlayer((player) => ({ ...player, color }));
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
                  setPlayer((player) => ({ ...player, role }));
                }}
              >
                <option value="leader">Lider</option>
                <option value="guesser">Zgadywacz</option>
              </select>

              {player.nick && player.color && player.role && (
                <>
                  <p>
                    Dołącz do gry jako "{player.nick}",{" "}
                    {player.role === "leader" ? "lider " : "zgadywacz "}
                    drużyny{" "}
                    {player.color === "red" ? "czerwonych" : "niebieskich"}
                  </p>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("join game", game);
                      updateGame(game.name, (remoteGame) =>
                        addPlayer(remoteGame, player)
                      )
                        .then(() => updatePlayer(player, gameName))
                        .then(() => router.push(`/game/${gameName}`))
                        .catch((e) => alert(e));
                    }}
                  >
                    Dołącz
                  </button>
                </>
              )}
            </>
          ) : (
            <p>Nie ma takiej gry, sory :(</p>
          )}
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

export default Join;
