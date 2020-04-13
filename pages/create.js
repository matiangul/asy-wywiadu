import Head from "next/head";
import { component, global } from "../src/navigation/styles";
import { useState } from "react";

const Create = () => {
  const [words, setWords] = useState([]);
  const [word, setWord] = useState("");

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
