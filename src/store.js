import firebase from "./firebase";
import { createGame, normalizeGame } from "./game";
import { wordsGenerator } from "./words";

export function createNewGame(startingColor) {
  const game = createGame(wordsGenerator(25), startingColor);

  return firebase
    .database()
    .ref(`/game/${game.name}`)
    .set(game)
    .then(() => {
      return game;
    });
}

export function updateGame(gameName, change) {
  return firebase
    .database()
    .ref(`/game/${gameName}`)
    .transaction(function (game) {
      if (game) {
        return change(game);
      }
      return game;
    })
    .catch((err) => console.error(err));
}

export function loadGame(gameName) {
  return firebase
    .database()
    .ref(`/game/${gameName}`)
    .once("value")
    .then((gameSnapshot) => {
      const game = gameSnapshot.val();
      return game ? normalizeGame(game) : null;
    });
}

export function watchGame(gameName, setGame) {
  if (gameName) {
    firebase
      .database()
      .ref(`/game/${gameName}`)
      .on("value", function (gameSnapshot) {
        const game = gameSnapshot.val();
        setGame(game ? normalizeGame(game) : null);
      });
  }
}

export function updatePlayer(player, gameName) {
  return Promise.resolve(
    sessionStorage.setItem(`player-${gameName}`, JSON.stringify(player))
  );
}

export function loadPlayer(gameName) {
  return Promise.resolve(
    JSON.parse(sessionStorage.getItem(`player-${gameName}`))
  );
}
