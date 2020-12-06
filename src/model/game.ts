import { v4 as uuid } from 'uuid';
import {
  Color,
  colorWords,
  isRoundTerminatingColor,
  isTeamColor,
  oppositeTeamColor,
  TeamColor,
} from './color';
import {
  arePlayersSame,
  fellowGuessers,
  fellowLeaders,
  isGuesser,
  isLeader,
  Player,
} from './player';
import { Word } from './word';

type UUID = string;
type Timestamp = number;
export type CardIndex = number;
type Vote = Player['nick'];
type Votes = Vote[];

export interface Game {
  name: UUID;
  round: number;
  startingColor: TeamColor;
  roundsPassword: string[];
  players: Player[];
  started: Timestamp;
  roundsEndRoundVotes: Votes[];
  selected: CardIndex[];
  board: Card[];
}

export interface Card {
  word: Word;
  votesPerRound: Votes[];
  color: Color;
}

export function createGame(words: Word[], startingColor: TeamColor): Game {
  const coloredWords = colorWords(words, startingColor);

  return {
    name: uuid(),
    round: 0,
    startingColor,
    roundsPassword: [''],
    players: [],
    started: null,
    roundsEndRoundVotes: [[]],
    selected: [],
    board: words.map((word) => ({
      word,
      votesPerRound: [[]],
      color: coloredWords.get(word),
    })),
  };
}

export function normalizeGame(game?: Partial<Game>): Game {
  if (typeof game !== 'object' || game === null) {
    throw new Error('Invalid game passed!');
  }
  if (typeof game.name !== 'string') {
    throw new Error('Game has invalid name!');
  }
  if (typeof game.round !== 'number') {
    throw new Error('Game has invalid round!');
  }
  if (!isTeamColor(game.startingColor)) {
    throw new Error('Game has invalid starting color!');
  }
  game.roundsPassword = normalizeArrayToCurrentRound<string>(
    () => '',
    game.round,
    game.roundsPassword
  );
  if (!Array.isArray(game.players)) {
    game.players = [];
  }
  game.roundsEndRoundVotes = normalizeArrayToCurrentRound<Votes>(
    () => [],
    game.round,
    game.roundsEndRoundVotes
  );
  if (!Array.isArray(game.selected)) {
    game.selected = [];
  }
  if (!Array.isArray(game.board)) {
    throw new Error('Game has no cards!');
  }
  game.board = game.board.map((card) => ({
    ...card,
    votesPerRound: normalizeArrayToCurrentRound<Votes>(() => [], game.round, card.votesPerRound),
  }));

  return game as Game;
}

function normalizeArrayToCurrentRound<T>(def: () => T, round: Game['round'], arr?: T[]): T[] {
  if (!Array.isArray(arr) || (arr?.length ?? 0) < round + 1) {
    return Array(round + 1)
      .fill(def())
      .map((_, index) => arr?.[index] ?? def());
  }
  return arr;
}

export function selectedCards(game: Game): Card[] {
  return game.selected.map((cardIndex) => game.board[cardIndex]);
}

export function isBombCardSelected(game: Game): boolean {
  return !!selectedCards(game).find(({ color }) => 'bomb' === color);
}

export function isPlayerInTheGame(game: Game, player: Player): boolean {
  return !!game.players.find((p) => arePlayersSame(p, player));
}

export function voteForRoundEnd(game: Game, player: Player): Game {
  const votes = game.roundsEndRoundVotes[game.round]
    .filter((vote) => !areVotesSame(vote, getPlayersVote(player)))
    .concat(getPlayersVote(player));

  const newRoundsEndRoundVotes = [...game.roundsEndRoundVotes];
  newRoundsEndRoundVotes[game.round] = votes;

  const changedGame = cloneGame(game);
  changedGame.roundsEndRoundVotes = newRoundsEndRoundVotes;

  const guessers = fellowGuessers(changedGame.players, player);

  if (changedGame.roundsEndRoundVotes[game.round].length === guessers.length) {
    return nextRound(changedGame);
  }

  return changedGame;
}

function getPlayersVote(player: Player): Vote {
  return player.nick;
}

function areVotesSame(voteA: Vote, voteB: Vote): boolean {
  return voteA === voteB;
}

export function cloneGame(game: Game): Game {
  return normalizeGame(JSON.parse(JSON.stringify(game)));
}

export function nextRound(game: Game): Game {
  const changedGame = cloneGame(game);

  changedGame.round += 1;

  return normalizeGame(changedGame);
}

export function toggleCard(game: Game, player: Player, cardIndex: CardIndex): Game {
  if (
    game.started &&
    isPlayersRound(game, player) &&
    isGuesser(player) &&
    !isCardSelected(game, cardIndex)
  ) {
    const changedGame = cloneGame(game);

    removeCardVoteForRoung(changedGame, getPlayersVote(player), cardIndex);

    if (!isPlayersCardVoteInRound(game, player, cardIndex)) {
      addCardVoteForRound(changedGame, getPlayersVote(player), cardIndex);
    }

    if (
      fellowGuessers(changedGame.players, player).length ===
      getCardVotesPerRound(changedGame, cardIndex).length
    ) {
      changedGame.selected.push(cardIndex);
    }

    if (
      isCardSelected(changedGame, cardIndex) &&
      isRoundTerminatingColor(getCardColor(game, cardIndex), player.color)
    ) {
      return nextRound(changedGame);
    }

    return changedGame;
  }

  return game;
}

function getCardColor(game: Game, cardIndex: CardIndex): Color {
  return game.board[cardIndex].color;
}

export function isPlayersRound(game: Game, player: Player): boolean {
  return roundsColor(game) === player.color;
}

export function allTeamCards(game: Game, teamColor: TeamColor): Card[] {
  return game.board.filter(({ color }) => teamColor === color);
}

export function selectedTeamCards(game: Game, teamColor: TeamColor): Card[] {
  return selectedCards(game).filter(({ color }) => teamColor === color);
}

export function isCardSelected(game: Game, cardIndex: CardIndex): boolean {
  return game.selected.indexOf(cardIndex) >= 0;
}

export function remainingTeamCardsCount(game: Game, teamColor: TeamColor): number {
  return allTeamCards(game, teamColor).length - selectedTeamCards(game, teamColor).length;
}

export function roundsColor(game: Game): TeamColor {
  return game.round % 2 === 0 ? game.startingColor : oppositeTeamColor(game.startingColor);
}

export function startGame(game: Game): Game {
  const changedGame = cloneGame(game);

  changedGame.started = Date.now();

  return changedGame;
}

export function addPlayer(game: Game, newPlayer: Player): Game {
  if (game.players.find((player) => arePlayersSame(player, newPlayer))) {
    throw new Error('Player with that nick already joined the game.');
  }

  if (isLeader(newPlayer) && fellowLeaders(game.players, newPlayer).length > 0) {
    throw new Error('There is already leader in this team.');
  }

  const changedGame = cloneGame(game);

  changedGame.players = game.players.concat(newPlayer);

  return changedGame;
}

export function setRoundsPassword(game: Game, password: string): Game {
  const changedGame = cloneGame(game);

  changedGame.roundsPassword[game.round] = password;

  return changedGame;
}

export function areWordsVisible(game: Game): boolean {
  return !!game.started;
}

export function isCardsColorVisible(game: Game, player: Player, cardIndex: CardIndex): boolean {
  return (
    !!game.started && (isLeader(player) || (isGuesser(player) && isCardSelected(game, cardIndex)))
  );
}

export function areVotesVisible(game: Game, cardIndex: CardIndex): boolean {
  return (
    !!game.started &&
    !isCardSelected(game, cardIndex) &&
    getCardVotesPerRound(game, cardIndex).length > 0
  );
}

export function getCardVotesPerRound(game: Game, cardIndex: CardIndex): Votes {
  return Array.from(new Set(game.board[cardIndex].votesPerRound[game.round]));
}

export function isMyVoteForCardInRound(game: Game, player: Player, cardIndex: CardIndex): boolean {
  return !!getCardVotesPerRound(game, cardIndex).find((vote) => vote === getPlayersVote(player));
}

export function hasLeader(game: Game, color: TeamColor): boolean {
  return game.players.findIndex((p) => isLeader(p) && p.color === color) !== -1;
}

export function groupedPlayers(game: Game): Game['players'] {
  return game.players.sort((p1, p2) => p1.color < p2.color ? -1 : 1);
}

function addCardVoteForRound(game: Game, vote: Vote, cardIndex: CardIndex): void {
  game.board[cardIndex].votesPerRound[game.round].push(vote);
}

function removeCardVoteForRoung(game: Game, vote: Vote, cardIndex: CardIndex): void {
  game.board[cardIndex].votesPerRound[game.round] = game.board[cardIndex].votesPerRound[
    game.round
  ].filter((existingVote) => existingVote !== vote);
}

function isPlayersCardVoteInRound(game: Game, player: Player, cardIndex: CardIndex): boolean {
  return !!getCardVotesPerRound(game, cardIndex).find((vote) =>
    areVotesSame(vote, getPlayersVote(player))
  );
}
