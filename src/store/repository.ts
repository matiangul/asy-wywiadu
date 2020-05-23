import firebase from "./firebase";
import { normalizeGame, Game } from "../model/game";
import * as Sentry from "@sentry/browser";
import { Player } from "../model/player";

export async function createNewGame(game: Game): Promise<Game> {
  try {
    await firebase.database().ref(`/game/${game.name}`).set(game);
  } catch (err) {
    Sentry.captureException(err);
  } finally {
    return game;
  }
}

/**
 * sometimes firebase couldn't load game, it will retry itself again
 */
export async function updateGame(
  gameName: Game["name"],
  modifyGame: (remoteGame: Game) => Game
): Promise<void> {
  try {
    await firebase
      .database()
      .ref(`/game/${gameName}`)
      .transaction((remoteGame?: Partial<Game>) =>
        !!remoteGame ? modifyGame(normalizeGame(remoteGame)) : remoteGame
      );
  } catch (err) {
    Sentry.captureException(err);
  }
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

export function updatePlayer(
  player: Player,
  gameName: Game["name"]
): Promise<void> {
  return Promise.resolve(
    sessionStorage.setItem(`player-${gameName}`, JSON.stringify(player))
  );
}

export function loadPlayer(gameName: Game["name"]): Promise<Player | null> {
  return Promise.resolve(
    JSON.parse(sessionStorage.getItem(`player-${gameName}`))
  );
}
