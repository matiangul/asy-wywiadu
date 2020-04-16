import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { component, global } from "../src/navigation/styles";

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
    setPlayer((player) => {
      const storedPlayer = sessionStorage.getItem(`player-${gameName}`);
      return storedPlayer ? JSON.parse(storedPlayer) : player;
    });
  }, [gameName]);
  // game state
  const [game, setGame] = useState(null);
  useEffect(() => {
    setGame(JSON.parse(sessionStorage.getItem(`${gameName}`)));
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
        <form action={`/game/${gameName}`}>
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
                  setPlayer((player) => {
                    const players = "players" in game ? game.players : [];
                    if (players.find((p) => p.nick === nick)) {
                      alert("Player with that name already joined the game");
                      return player;
                    }
                    if (
                      player.role === "leader" &&
                      players.find(
                        (p) => p.role === "leader" && p.color === player.color
                      )
                    ) {
                      alert("There is already leader for that team");
                      return player;
                    }
                    sessionStorage.setItem(
                      `player-${gameName}`,
                      JSON.stringify({
                        ...player,
                        nick,
                      })
                    );
                    return { ...player, nick };
                  });
                }}
              />
              <p>Wybierz drużynę</p>
              <select
                name="playerColor"
                value={player.color}
                onChange={(e) => {
                  const color = e.target.value;
                  setPlayer((player) => {
                    const players = "players" in game ? game.players : [];
                    if (players.find((p) => p.nick === player.nick)) {
                      alert("Player with that name already joined the game");
                      return player;
                    }
                    if (
                      player.role === "leader" &&
                      players.find(
                        (p) => p.role === "leader" && p.color === color
                      )
                    ) {
                      alert("There is already leader for that team");
                      return player;
                    }
                    sessionStorage.setItem(
                      `player-${gameName}`,
                      JSON.stringify({
                        ...player,
                        color,
                      })
                    );
                    return { ...player, color };
                  });
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
                  setPlayer((player) => {
                    const players = "players" in game ? game.players : [];
                    if (players.find((p) => p.nick === player.nick)) {
                      alert("Player with that name already joined the game");
                      return player;
                    }
                    if (
                      role === "leader" &&
                      players.find(
                        (p) => p.role === "leader" && p.color === player.color
                      )
                    ) {
                      alert("There is already leader for that team");
                      return player;
                    }
                    sessionStorage.setItem(
                      `player-${gameName}`,
                      JSON.stringify({
                        ...player,
                        role,
                      })
                    );
                    return { ...player, role };
                  });
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
                    onClick={() =>
                      setGame((game) => {
                        const players = "players" in game ? game.players : [];
                        if (players.find((p) => p.nick === player.nick)) {
                          alert(
                            "Player with that name already joined the game"
                          );
                          return game;
                        }
                        if (
                          player.role === "leader" &&
                          players.find(
                            (p) =>
                              p.role === "leader" && p.color === player.color
                          )
                        ) {
                          alert("There is already leader for that team");
                          return game;
                        }
                        sessionStorage.setItem(
                          `${gameName}`,
                          JSON.stringify({
                            ...game,
                            players: players.concat(player),
                          })
                        );
                        sessionStorage.setItem(
                          `player-${gameName}`,
                          JSON.stringify(player)
                        );
                        return {
                          ...game,
                          players: players.concat(player),
                        };
                      })
                    }
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
