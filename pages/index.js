import Head from "next/head";
import Link from "next/link";
import { component, global } from "../src/navigation/styles";
import firebase from "../src/firebase";

const Home = () => {
  var gameRef = firebase.database().ref("/game/1");
  gameRef.on("value", function (gameSnapshot) {
    console.log("listener", gameSnapshot.val());
  });

  // remember to off listeners

  firebase
    .database()
    .ref("/game/1")
    .set(
      {
        name: "Mateusz",
      },
      function (error) {
        if (error) {
          console.log("Game set error");
        } else {
          console.log("Game set");
        }
      }
    );

  setTimeout(
    () =>
      firebase
        .database()
        .ref("/game/1")
        .transaction(function (game) {
          game.name = "1";
          console.log("transaction", game);
          return game;
        }),
    5000
  );

  firebase
    .database()
    .ref("/game/1")
    .once("value")
    .then(function (gameSnapshot) {
      console.log("read", gameSnapshot.val() || "nie ma");
    });

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
