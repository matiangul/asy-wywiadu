import firebase from "./firebase";
import { normalizeGame, Game, addPlayer } from "../model/game";
import * as Sentry from "@sentry/browser";
import { Player, arePlayersSame } from "../model/player";
import { isEqual } from "lodash";

export async function createNewGame(game: Game): Promise<Game> {
  try {
    await firebase.database().ref(`/game/${game.name}`).set(game);
  } catch (err) {
    Sentry.captureException(err);
  } finally {
    return game;
  }
}

export async function updateGame(
  gameName: Game["name"],
  modifyGame: (remoteGame: Game) => Game
): Promise<Game> {
  try {
    return await unhandledUpdateGame(gameName, modifyGame);
  } catch (err) {
    Sentry.captureException(err);
  }
}

/**
 * sometimes firebase couldn't load game, it will retry itself again
 */
async function unhandledUpdateGame(
  gameName: Game["name"],
  modifyGame: (remoteGame: Game) => Game
): Promise<Game> {
  let expected: Game;
  const transaction = await firebase
    .database()
    .ref(`/game/${gameName}`)
    .transaction((remoteGame?: Partial<Game>) => {
      if (!!remoteGame) {
        expected = modifyGame(normalizeGame(remoteGame));
        return expected;
      }

      return remoteGame;
    });
  const actual = normalizeGame(transaction.snapshot.val());
  if (isEqual(expected, actual)) {
    return actual;
  }
  throw new Error(`Game update failed. Expected ${JSON.stringify(expected)}. Actual ${JSON.stringify(actual)}.`);
}

export async function loadGame(gameName: Game["name"]): Promise<Game | null> {
  try {
    return await firebase
      .database()
      .ref(`/game/${gameName}`)
      .once("value")
      .then((snapshot) => snapshot.val())
      .then((remoteGame?: Partial<Game>) =>
        !!remoteGame ? normalizeGame(remoteGame) : null
      );
  } catch (err) {
    Sentry.captureException(err);
    return null;
  }
}

export async function watchGame(
  gameName: Game["name"],
  setGame: (game: Game) => void
): Promise<void> {
  try {
    await firebase.database().ref(`/game/${gameName}`).off("value");
    await firebase
      .database()
      .ref(`/game/${gameName}`)
      .on("value", (snapshot) => {
        const remoteGame: Partial<Game> | null = snapshot.val();
        if (!!remoteGame) {
          setGame(normalizeGame(remoteGame));
        }
      });
  } catch (err) {
    Sentry.captureException(err);
  }
}

export async function addGamePlayer(player: Player, game: Game): Promise<Game> {
  const newGame = await unhandledUpdateGame(game.name, (remoteGame) =>
    addPlayer(remoteGame, player)
  );
  sessionStorage.setItem(
    `player-${newGame.name}`,
    newGame.players
      .findIndex((existingPlayer) => arePlayersSame(existingPlayer, player))
      .toString()
  );
  return newGame;
}

export function loadPlayer(game: Game): Promise<Player | null> {
  const playerId = sessionStorage.getItem(`player-${game.name}`);
  if (playerId === null) {
    return Promise.resolve(null);
  }
  return Promise.resolve(game.players[parseInt(playerId, 10)] || null);
}
