import Head from "next/head";
import { useRouter } from "next/router";
import { component, global } from "../../src/navigation/styles";

const Game = () => {
  const router = useRouter();
  const { key } = router.query;

  return (
    <div className="container">
      <Head>
        <title>Asy wywiadu - {key}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Hej Asie</h1>
        <p className="description">Właśnie dołączyłeś do gry {key}</p>
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

export default Game;
