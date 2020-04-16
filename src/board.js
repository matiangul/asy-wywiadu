const Board = ({ role, board }) => (
  <>
    {board.map(({ color, word }) => (
      <div
        className={`memory-card ${role === "leader" ? color : ""}`}
        key={word}
      >
        <p>{word}</p>
      </div>
    ))}
  </>
);

export default Board;
