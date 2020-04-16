import Head from "next/head";
import { component, global } from "../src/navigation/styles";
import Game from "../src/game";
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
  const [game, setGame] = useState(null);

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
          disabled={!!game}
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
          disabled={!!game}
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
          disabled={!!game}
        >
          <option value="red">Czerwoni</option>
          <option value="blue">Niebiescy</option>
        </select>

        {!game && (
          <button
            onClick={() => {
              setGame(new Game(words, startingColor).save().name);
            }}
          >
            Stwórz grę
          </button>
        )}

        {game && (
          <>
            <p>
              Gra{" "}
              <a
                target="_blank"
                href={`${window.location.protocol}//${window.location.host}/join?name=${game}`}
              >
                {`${window.location.protocol}//${window.location.host}/join?name=${game}`}
              </a>{" "}
              czeka na rozpoczęcie
            </p>
            <button
              onClick={() => {
                const createdGame = JSON.parse(sessionStorage.getItem(game));
                sessionStorage.setItem(
                  game,
                  JSON.stringify({ ...createdGame, started: Date.now() })
                );
                router.push(`/join?name=${game}`);
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
