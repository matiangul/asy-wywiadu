import { Word } from "./word";

export type Color = "red" | "blue" | "bomb" | "miss";

export type TeamColor = "red" | "blue";

export function isRoundTerminatingColor(
  cardColor: Color,
  teamColor: TeamColor
): boolean {
  return cardColor === "miss" || cardColor === oppositeTeamColor(teamColor);
}

export function isTeamColor(color?: any): color is TeamColor {
  return color === "red" || color === "blue";
}

export function oppositeTeamColor(color: TeamColor): TeamColor {
  return color === "red" ? "blue" : "red";
}

type ColoredWords = Map<Word, Color>;

export function colorWords(
  words: Word[],
  startingColor: TeamColor
): ColoredWords {
  let indexes = new Uint16Array(words.length);
  window.crypto.getRandomValues(indexes);
  const otherColor = oppositeTeamColor(startingColor);

  return words
    .map((word, i) => ({ word, index: indexes[i] }))
    .sort(({ index: a }, { index: b }) => a - b)
    .reduce<ColoredWords>(
      (colored, { word }, i) =>
        colored.set(
          word,
          i < 9
            ? startingColor
            : i === 9
            ? "bomb"
            : i < 18
            ? otherColor
            : "miss"
        ),
      new Map()
    );
}
