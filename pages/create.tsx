import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Share from "../src/components/share";
import { component, global } from "../src/components/styles/welcome";
import { TeamColor } from "../src/model/color";
import { createGame, Game, startGame } from "../src/model/game";
import { wordsGenerator } from "../src/model/word";
import { createNewGame, updateGame } from "../src/store/repository";

export default () => {
  const router = useRouter();
  const [startingColor, changeStartingColor] = useState<TeamColor>("red");
  const [game, setGame] = useState<Partial<Game>>({ name: null });

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
          onChange={(e) => changeStartingColor(e.target.value as TeamColor)}
          disabled={!!game.name}
        >
          <option value="red">Czerwoni</option>
          <option value="blue">Niebiescy</option>
        </select>

        {!game.name && (
          <button
            onClick={() =>
              createNewGame(createGame(wordsGenerator(25), startingColor)).then(
                setGame
              )
            }
          >
            Stwórz grę
          </button>
        )}

        {game.name && (
          <>
            <Share gameName={game.name} />
            <p>A następnie:</p>
            <button
              onClick={() => {
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
