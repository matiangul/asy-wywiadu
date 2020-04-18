import Head from "next/head";
import { component, global } from "../src/navigation/styles";
import { createGame, saveGame } from "../src/game";
import { useState } from "react";
import { useRouter } from "next/router";

const Create = () => {
  const router = useRouter();
  const [words, setWords] = useState([
    "There",
    "is",
    "no",
    "one",
    "byk",
    "loves",
    "joy",
    "itself",
    "who",
    "seeks",
    "after",
    "up",
    "and",
    "wants",
    "to",
    "have",
    "on",
    "simply",
    "because",
    "it",
    "are",
    "pain",
    "hehe",
    "rata",
    "end",
  ]);
  const [word, setWord] = useState("");
  const [startingColor, changeStartingColor] = useState("red");
  const [gameName, setGameName] = useState(null);

  return (
    <div className="container">
      <Head>
        <title>Asy wywiadu - stwórz nową grę</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Hej Asie</h1>
        <p className="description">Jesteś w trybie tworzenia nowej rozgrywki</p>

        <input
          type="text"
          name="word"
          placeholder="Hasło"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          disabled={!!gameName}
        />
        <button
          onClick={() => {
            setWord("");
            if (word.trim().length === 0) {
              return alert("Puste słowa nic dla mnie nie znaczą");
            }
            if (words.indexOf(word) !== -1) {
              return alert("To już było");
            }
            setWords((list) => list.concat(word.trim()));
          }}
          disabled={!!gameName}
        >
          Dodaj
        </button>

        <ul>
          {words.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>

        <h5>Kto zaczyna?</h5>
        <select
          value={startingColor}
          onChange={(e) => changeStartingColor(e.target.value)}
          disabled={!!gameName}
        >
          <option value="red">Czerwoni</option>
          <option value="blue">Niebiescy</option>
        </select>

        {!gameName && (
          <button
            onClick={() => {
              const game = createGame(words, startingColor);
              saveGame(game);
              setGameName(game.name);
            }}
          >
            Stwórz grę
          </button>
        )}

        {gameName && (
          <>
            <p>
              Gra{" "}
              <a
                target="_blank"
                href={`${window.location.protocol}//${window.location.host}/join?name=${gameName}`}
              >
                {`${window.location.protocol}//${window.location.host}/join?name=${gameName}`}
              </a>{" "}
              czeka na rozpoczęcie
            </p>
            <button
              onClick={() => {
                const createdGame = JSON.parse(localStorage.getItem(gameName));
                localStorage.setItem(
                  gameName,
                  JSON.stringify({ ...createdGame, started: Date.now() })
                );
                router.push(`/join?name=${gameName}`);
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
