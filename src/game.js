import { v4 as uuid } from "uuid";

export function createGame(words, startingColor) {
  const limitedWords = words.slice(0, 25);
  const coloredWords = colorWords(limitedWords, startingColor);

  return {
    board: limitedWords.map((word) => ({
      word,
      votesPerRound: [[]],
      color: coloredWords[word],
    })),
    selected: [],
    round: 0,
    roundsColor: [startingColor],
    roundsPassword: [""],
    players: [],
    name: uuid(),
    started: null,
    roundsEndRoundVotes: [],
  };
}

function colorWords(words, startingColor) {
  let indexes = new Uint8Array(25);
  window.crypto.getRandomValues(indexes);
  const otherColor = oppositeColor(startingColor);

  return words
    .map((word, i) => ({ word, index: indexes[i] }))
    .sort(({ index: a }, { index: b }) => a - b)
    .reduce(
      (colored, { word }, i) => ({
        ...colored,
        [word]:
          i < 8
            ? startingColor
            : i === 8
            ? "black"
            : i > 18
            ? otherColor
            : "yellow",
      }),
      {}
    );
}

export function nextRound(game) {
  game.round += 1;
  game.roundsColor[game.round] = oppositeColor(
    game.roundsColor[game.round - 1]
  );
  game.roundsPassword[game.round] = "";
}

export function saveGame(game) {
  localStorage.setItem(game.name, JSON.stringify(game));
}

export function arePlayersSame(player1, player2) {
  return player1.nick === player2.nick;
}

export function selectedCards(game) {
  if (!game) {
    return [];
  }

  return game.board.filter((_, cardIndex) => game.selected[cardIndex]);
}

export function oppositeColor(color) {
  return color === "red" ? "blue" : "red";
}
