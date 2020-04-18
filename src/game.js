import { v4 as uuid } from "uuid";

class Game {
  /**
   * @param {string[]} words
   * @param {string} startingColor
   */
  constructor(words, startingColor) {
    const coloredWords = Game.colorWords(words, startingColor);
    this.board = words.map((word) => ({
      word,
      votesPerRound: [[]],
      color: coloredWords[word],
    }));
    this.selected = [];
    this.round = 0;
    this.roundsColor = [startingColor];
    this.roundsPassword = [""];
    this.players = [];
    this.name = uuid();
    this.started = null;
    this.roundsEndRoundVotes = [];
  }

  static colorWords(words, startingColor) {
    let indexes = new Uint8Array(25);
    window.crypto.getRandomValues(indexes);
    const otherColor = Game.secondaryColor(startingColor);

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

  static secondaryColor(primaryColor) {
    return primaryColor === "red" ? "blue" : "red";
  }

  toJSON() {
    return { ...this };
  }

  save() {
    localStorage.setItem(this.name, JSON.stringify(this.toJSON()));
    return this;
  }
}

export function nextRound(game) {
  game.round += 1;
  game.roundsColor[game.round] = Game.secondaryColor(
    game.roundsColor[game.round - 1]
  );
  game.roundsPassword[game.round] = "";
  saveGame(game);
}

export function saveGame(game) {
  localStorage.setItem(game.name, JSON.stringify(game));
}

export function arePlayersSame(player1, player2) {
  return player1.nick === player2.nick;
}

export default Game;
