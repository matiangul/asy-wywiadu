import Head from "next/head";
import Link from "next/link";
import { component, global } from "../src/navigation/styles";

const Home = () => {
  return (
    <div className="container">
      <Head>
        <title>Asy wywiadu</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Witam w grze Asy Wywiadu</h1>
        <p className="description">
          Możesz tutaj stworzyć nową grę lub dołączyć do istniejącej
        </p>

        <div className="grid">
          <Link href="/create">
            <div className="card">
              <h3>Rozpocznij nową grę</h3>
              <p>Tutaj możesz stworzyć nową rozgrywkę dla swoich znajomych</p>
            </div>
          </Link>

          <Link href="/join">
            <div className="card">
              <h3>Dołącz do gry</h3>
              <p>Tutaj możesz dołączyć do już istniejącej rozgrywki</p>
            </div>
          </Link>
        </div>
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

export default Home;
