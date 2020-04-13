import Head from "next/head";
import { useRouter } from "next/router";
import { component, global } from "../src/navigation/styles";

const Join = () => {
  const router = useRouter();

  function join(event) {
    const gameKey = new FormData(event.target).get("id");
    router.push(`/game/${gameKey}`);
    event.preventDefault();
  }

  return (
    <div className="container">
      <Head>
        <title>Asy wywiadu - dołącz do gry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Hej Asie</h1>
        <p className="description">Tutaj możesz dołączyć do istniejącej gry</p>
        <form onSubmit={join}>
          <input type="text" name="id" placeholder="Klucz do gry" />
          <button>Dołącz</button>
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
