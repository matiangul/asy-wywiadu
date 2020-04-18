import {
  oppositeColor,
  arePlayersSame,
  saveGame,
  nextRound,
} from "../src/game";

const Board = ({ player, game }) => {
  const guessers = game.players.filter(
    (teammate) => teammate.color === player.color && teammate.role === "guesser"
  );

  const isWordVisible = game.started;

  function toggleCard(cardIndex) {
    if (
      game.started &&
      game.roundsColor[game.round] === player.color &&
      player.role === "guesser" &&
      !game.selected[cardIndex]
    ) {
      const exists = (
        game.board[cardIndex].votesPerRound[game.round] || []
      ).find((vote) => arePlayersSame(vote, player));

      game.board[cardIndex].votesPerRound[game.round] = (
        game.board[cardIndex].votesPerRound[game.round] || []
      ).filter((vote) => !arePlayersSame(vote, player));

      if (!exists) {
        game.board[cardIndex].votesPerRound[game.round] = (
          game.board[cardIndex].votesPerRound[game.round] || []
        ).concat(player);
      }

      if (
        guessers.length ===
        (game.board[cardIndex].votesPerRound[game.round] || []).length
      ) {
        game.selected[cardIndex] = true;
        if (
          game.board[cardIndex].color === "yellow" ||
          game.board[cardIndex].color === oppositeColor(player.color)
        ) {
          nextRound(game);
        }
      }

      saveGame(game);
    }
  }

  function isColorVisible(cardIndex) {
    return (
      game.started &&
      (player.role === "leader" ||
        (player.role === "guesser" && game.selected[cardIndex] === true))
    );
  }

  function areVotesVisible(cardIndex) {
    return (
      game.started &&
      player.role === "guesser" &&
      (game.board[cardIndex].votesPerRound[game.round] || []).length > 0
    );
  }

  return (
    <>
      {game.board.map((card, cardIndex) => (
        <div
          onClick={toggleCard.bind(null, cardIndex)}
          className={`memory-card ${
            isColorVisible(cardIndex) ? card.color : ""
          }`}
          key={card.word}
        >
          <p>{isWordVisible && card.word}</p>
          {areVotesVisible(cardIndex) && (
            <p>{(card.votesPerRound[game.round] || []).length}</p>
          )}
        </div>
      ))}
    </>
  );
};

export default Board;
