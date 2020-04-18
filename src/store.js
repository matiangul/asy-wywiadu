import { createGame, normalizeGame } from "./game";
import firebase from "./firebase";

export function createNewGame(words, startingColor) {
  const game = createGame(words, startingColor);

  return firebase
    .database()
    .ref(`/game/${game.name}`)
    .set(game)
    .then(() => {
      console.log("create game", game);
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
    .then(({ snapshot }) => console.log("after transaction", snapshot.val()))
    .catch((err) => console.error(err));
}

export function loadGame(gameName) {
  return firebase
    .database()
    .ref(`/game/${gameName}`)
    .once("value")
    .then((gameSnapshot) => {
      console.log("load game", gameSnapshot);
      return normalizeGame(gameSnapshot.val()) || null;
    });
}

export function updatePlayer(player, gameName) {
  console.log("update player", player, gameName);
  return Promise.resolve(
    sessionStorage.setItem(`player-${gameName}`, JSON.stringify(player))
  );
}

export function loadPlayer(gameName) {
  console.log("get", `player-${gameName}`);
  return Promise.resolve(
    JSON.parse(sessionStorage.getItem(`player-${gameName}`))
  );
}
