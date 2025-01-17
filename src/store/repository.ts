import * as Sentry from '@sentry/browser';
import { firestore as Firestore } from 'firebase';
import { isEqual } from 'lodash';
import { addPlayer, Game, normalizeGame } from '../model/game';
import { arePlayersSame, Player } from '../model/player';
import firebase from './firebase';

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
  gameName: Game['name'],
  modifyGame: (remoteGame: Game) => Game
): Promise<Game> {
  try {
    return await unhandledUpdateGame(gameName, modifyGame);
  } catch (err) {
    Sentry.captureException(err);
  }
}

export class GameUpdateError extends Error {
  public constructor(expected: Game, actual: Game) {
    super(
      `Game update failed. Expected ${JSON.stringify(expected)}. Actual ${JSON.stringify(actual)}.`
    );
  }
}

/**
 * sometimes firebase couldn't load game, it will retry itself again
 */
async function unhandledUpdateGame(
  gameName: Game['name'],
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
  throw new GameUpdateError(expected, actual);
}

export async function loadGame(gameName: Game['name']): Promise<Game | null> {
  try {
    return await firebase
      .database()
      .ref(`/game/${gameName}`)
      .once('value')
      .then((snapshot) => snapshot.val())
      .then((remoteGame?: Partial<Game>) => (!!remoteGame ? normalizeGame(remoteGame) : null));
  } catch (err) {
    Sentry.captureException(err);
    return null;
  }
}

export async function watchGame(
  gameName: Game['name'],
  setGame: (game: Game) => void
): Promise<void> {
  try {
    await firebase.database().ref(`/game/${gameName}`).off('value');
    await firebase
      .database()
      .ref(`/game/${gameName}`)
      .on('value', (snapshot) => {
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
    newGame.players.findIndex((existingPlayer) => arePlayersSame(existingPlayer, player)).toString()
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

function getMesssagesRef(gameName: Game['name']): Firestore.CollectionReference {
  try {
    return firebase.firestore().collection('games').doc(gameName).collection('messages');
  } catch (err) {
    Sentry.captureException(err);
  }
}

export function getMessagesQuery(gameName: Game['name']): Firestore.Query {
  return getMesssagesRef(gameName).orderBy('createdAt');
}

export async function postMessage(
  gameName: Game['name'],
  { text, nick }: { text: string; nick: string }
): Promise<void> {
  try {
    const ref = getMesssagesRef(gameName);

    await ref.add({
      text,
      nick,
      createdAt: Firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    Sentry.captureException(err);
  }
}
