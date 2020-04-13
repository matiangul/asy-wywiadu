import Head from "next/head";
import { component, global } from "../src/navigation/styles";

const Create = () => (
  <div className="container">
    <Head>
      <title>Asy wywiadu - stwórz nową grę</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <h1 className="title">Hej Asie</h1>
      <p className="description">Jesteś w trybie tworzenia nowej rozgrywki</p>
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

export default Create;
