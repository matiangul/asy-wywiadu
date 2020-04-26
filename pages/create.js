import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { startGame } from "../src/game";
import { component, global } from "../src/navigation/styles";
import { createNewGame, updateGame } from "../src/store";

const Create = () => {
  const router = useRouter();
  const [startingColor, changeStartingColor] = useState("red");
  const [game, setGame] = useState({ name: null });

  return (
    <div className="container">
      <Head>
        <title>Asy wywiadu - stwórz nową grę</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Hej Asie</h1>
        <p className="description">Jesteś w trybie tworzenia nowej rozgrywki</p>

        <h5>Kto zaczyna?</h5>
        <select
          value={startingColor}
          onChange={(e) => changeStartingColor(e.target.value)}
          disabled={!!game.name}
        >
          <option value="red">Czerwoni</option>
          <option value="blue">Niebiescy</option>
        </select>

        {!game.name && (
          <button onClick={() => createNewGame(startingColor).then(setGame)}>
            Stwórz grę
          </button>
        )}

        {game.name && (
          <>
            <p>
              Gra{" "}
              <a
                target="_blank"
                href={`${window.location.protocol}//${window.location.host}/join?name=${game.name}`}
              >
                {`${window.location.protocol}//${window.location.host}/join?name=${game.name}`}
              </a>{" "}
              czeka na rozpoczęcie
            </p>
            <button
              onClick={() => {
                console.log("start game", game);
                updateGame(game.name, (remoteGame) =>
                  startGame(remoteGame)
                ).then(() => router.push(`/join?name=${game.name}`));
              }}
            >
              Rozpocznij grę
            </button>
          </>
        )}
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

export default Create;
