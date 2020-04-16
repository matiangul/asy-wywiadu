const Board = ({ role, board, round }) => (
  <>
    {board.map(({ color, word, voteCountPerRound }) => (
      <div
        className={`memory-card ${role === "leader" ? color : ""}`}
        key={word}
      >
        <p>{word}</p>
        {role === "guesser" && voteCountPerRound[round] > 0 && (
          <p>{voteCountPerRound[round]}</p>
        )}
      </div>
    ))}
  </>
);

export default Board;
