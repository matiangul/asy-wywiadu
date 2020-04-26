import { v4 as uuid } from "uuid";

export function createGame(words, startingColor) {
  const coloredWords = colorWords(words, startingColor);

  return {
    board: words.map((word) => ({
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

export function normalizeGame(game) {
  game.board = game.board.map((card) => ({
    ...card,
    votesPerRound: card.votesPerRound || [[]],
  }));
  game.selected = game.selected || [];
  game.players = game.players || [];
  game.roundsEndRoundVotes = game.roundsEndRoundVotes || [];

  console.log(game);

  return game;
}

function colorWords(words, startingColor) {
  let indexes = new Uint16Array(words.length);
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

export function arePlayersSame(player1, player2) {
  return player1.nick === player2.nick;
}

export function selectedCards(game) {
  if (!game) {
    return [];
  }

  return game.board.filter((_, cardIndex) => (game.selected || [])[cardIndex]);
}

export function oppositeColor(color) {
  return color === "red" ? "blue" : "red";
}

export function voteForRoundEnd(game, player) {
  const votes = ((game.roundsEndRoundVotes || [])[game.round] || [])
    .filter((vote) => !arePlayersSame(vote, player))
    .concat(player);

  const newRoundsEndRoundVotes = [...(game.roundsEndRoundVotes || [])];
  newRoundsEndRoundVotes[game.round] = votes;

  const changedGame = cloneGame(game);
  changedGame.roundsEndRoundVotes = newRoundsEndRoundVotes;

  const guessers = (changedGame.players || []).filter(
    (teammate) => teammate.color === player.color && teammate.role === "guesser"
  );

  if (changedGame.roundsEndRoundVotes[game.round].length === guessers.length) {
    nextRound(changedGame);
  }

  return changedGame;
}

export function cloneGame(game) {
  return normalizeGame(JSON.parse(JSON.stringify(game)));
}

export function nextRound(game) {
  const changedGame = cloneGame(game);

  changedGame.round += 1;
  changedGame.roundsColor[changedGame.round] = oppositeColor(
    (changedGame.roundsColor || [])[changedGame.round - 1]
  );
  changedGame.roundsPassword[changedGame.round] = "";

  return changedGame;
}

export function toggleCard(game, player, cardIndex) {
  if (
    game.started &&
    (game.roundsColor || [])[game.round] === player.color &&
    player.role === "guesser" &&
    !(game.selected || [])[cardIndex]
  ) {
    const guessers = (game.players || []).filter(
      (teammate) =>
        teammate.color === player.color && teammate.role === "guesser"
    );

    const exists = (
      (game.board[cardIndex].votesPerRound || [])[game.round] || []
    ).find((vote) => arePlayersSame(vote, player));

    const changedGame = cloneGame(game);

    console.log(changedGame);

    changedGame.board[cardIndex].votesPerRound[changedGame.round] = (
      (changedGame.board[cardIndex].votesPerRound || [])[changedGame.round] ||
      []
    ).filter((vote) => !arePlayersSame(vote, player));

    if (!exists) {
      changedGame.board[cardIndex].votesPerRound[changedGame.round] = (
        (changedGame.board[cardIndex].votesPerRound || [])[changedGame.round] ||
        []
      ).concat(player);
    }

    if (
      guessers.length ===
      (
        (changedGame.board[cardIndex].votesPerRound || [])[changedGame.round] ||
        []
      ).length
    ) {
      changedGame.selected[cardIndex] = true;
      if (
        changedGame.board[cardIndex].color === "yellow" ||
        changedGame.board[cardIndex].color === oppositeColor(player.color)
      ) {
        nextRound(changedGame);
      }
    }

    return changedGame;
  }
}

export function startGame(game) {
  const changedGame = cloneGame(game);

  changedGame.started = Date.now();

  return changedGame;
}

export function addPlayer(game, player) {
  console.log("add player game", game);
  const players = "players" in game ? game.players : [];

  if (players.find((p) => p.nick === player.nick)) {
    throw new Error("Player with that name already joined the game");
  }

  if (
    player.role === "leader" &&
    players.find((p) => p.role === "leader" && p.color === player.color)
  ) {
    throw new Error("There is already leader for that team");
  }

  const changedGame = cloneGame(game);

  changedGame.players = players.concat(player);

  return changedGame;
}

export function setRoundsPassword(game, password) {
  const changedGame = cloneGame(game);

  changedGame.roundsPassword[game.round] = password;

  return changedGame;
}
