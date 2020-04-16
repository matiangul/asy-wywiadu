import Head from "next/head";
import { useRouter } from "next/router";
import { component, global } from "../src/navigation/styles";
import Game from "../src/game";
import { useState } from "react";

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
        >
          <option value="red">Czerwoni</option>
          <option value="blue">Niebiescy</option>
        </select>

        <button
          onClick={() => {
            const game = new Game(words, startingColor).save();
            router.push(`/join?name=${game.name}`);
          }}
        >
          Rozpocznij grę
        </button>
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
