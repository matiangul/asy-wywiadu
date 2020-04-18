import { toggleCard } from "./game";
import { updateGame } from "./store";

const Board = ({ player, game }) => {
  const isWordVisible = game.started;

  function isColorVisible(cardIndex) {
    return (
      game.started &&
      (player.role === "leader" ||
        (player.role === "guesser" &&
          (game.selected || [])[cardIndex] === true))
    );
  }

  function areVotesVisible(cardIndex) {
    return (
      game.started &&
      player.role === "guesser" &&
      ((game.board[cardIndex].votesPerRound || [])[game.round] || []).length > 0
    );
  }

  return (
    <>
      {game.board.map((card, cardIndex) => (
        <div
          onClick={() => {
            console.log("toggle card", cardIndex);
            updateGame(game.name, (remoteGame) =>
              toggleCard(remoteGame, player, cardIndex)
            );
          }}
          className={`memory-card ${
            isColorVisible(cardIndex) ? card.color : ""
          }`}
          key={card.word}
        >
          <p>{isWordVisible && card.word}</p>
          {areVotesVisible(cardIndex) && (
            <p>{((card.votesPerRound || [])[game.round] || []).length}</p>
          )}
        </div>
      ))}
    </>
  );
};

export default Board;
