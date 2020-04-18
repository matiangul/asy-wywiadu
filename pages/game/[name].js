import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Board from "../../src/board";
import {
  arePlayersSame,
  nextRound,
  saveGame,
  selectedCards,
} from "../../src/game";

const Game = () => {
  const router = useRouter();
  const { name } = router.query;
  // load game
  const [game, setGame] = useState(null);
  useEffect(() => setGame(JSON.parse(localStorage.getItem(name))), [name]);
  // load player
  const [player, setPlayer] = useState(null);
  useEffect(
    () => setPlayer(JSON.parse(sessionStorage.getItem(`player-${name}`))),
    [name]
  );

  const selectedBlackCard = selectedCards(game).find(
    ({ color }) => "black" === color
  );
  if (selectedBlackCard) {
    return (
      <>
        {game.roundsColor[game.round] !== player.color && (
          <p className="text">Jesteś zwycięzcą!</p>
        )}
        {game.roundsColor[game.round] === player.color && (
          <p className="text">Pregraliście :(</p>
        )}
        <p>
          {game.roundsColor[game.round] === player.color
            ? "Niestety twoja "
            : "Przeciwna "}{" "}
          drużyna zaznaczyła czarną kartę.
        </p>
      </>
    );
  }

  if (!game) {
    return <p>Nic nie wiem o tej grze :(</p>;
  }

  if (!player || !game.players.find((p) => arePlayersSame(p, player))) {
    return <p>Ktoś ty?</p>;
  }

  return (
    <>
      <Board player={player} game={game} />

      {player.role === "leader" &&
        player.color === game.roundsColor[game.round] && (
          <>
            <p>Wpisz hasło dla swojej drużyny:</p>
            <input
              type="text"
              name="password"
              placeholder="Kostka 2"
              value={game.roundsPassword[game.round]}
              onChange={(e) => {
                const password = e.target.value;
                const changedRoundsPassword = [...game.roundsPassword];
                changedRoundsPassword[game.round] = password;
                setGame((game) => {
                  localStorage.setItem(
                    name,
                    JSON.stringify({
                      ...game,
                      roundsPassword: changedRoundsPassword,
                    })
                  );
                  return { ...game, roundsPassword: changedRoundsPassword };
                });
              }}
            />
          </>
        )}

      {player.role === "guesser" &&
        player.color === game.roundsColor[game.round] && (
          <button
            type="button"
            onClick={() => {
              setGame((game) => {
                const votes = (
                  (game.roundsEndRoundVotes || [])[game.round] || []
                )
                  .filter((vote) => !arePlayersSame(vote, player))
                  .concat(player);

                const newRoundsEndRoundVotes = [
                  ...(game.roundsEndRoundVotes || []),
                ];
                newRoundsEndRoundVotes[game.round] = votes;

                const changedGame = {
                  ...game,
                  roundsEndRoundVotes: newRoundsEndRoundVotes,
                };

                const guessers = changedGame.players.filter(
                  (teammate) =>
                    teammate.color === player.color &&
                    teammate.role === "guesser"
                );

                if (
                  changedGame.roundsEndRoundVotes[game.round].length ===
                  guessers.length
                ) {
                  nextRound(changedGame);
                }

                saveGame(changedGame);

                return changedGame;
              });
            }}
          >
            Poddaje się w tej rundzie
          </button>
        )}

      <p className="text">
        Kolej na
        {game.roundsColor[game.round] === player.color ? " twoją " : " drugą "}
        drużynę
      </p>
      <p className="text">
        {game.roundsColor[game.round] === player.color ? "Wasze " : "Ich "}
        hasło to: "{game.roundsPassword[game.round]}"
      </p>

      <style jsx="true" global>{`
        * {
          padding: 0;
          margin: 0;
          box-sizing: border-box;
        }

        body {
          height: 100vh;
          display: flex;
        }

        #__next {
          width: 640px;
          height: 640px;
          margin: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          perspective: 1000px;
        }

        .text {
          width: 100%;
          margin: 5px;
          position: relative;
        }

        .memory-card {
          width: calc(20% - 10px);
          height: calc(20% - 10px);
          margin: 5px;
          position: relative;
          transition: all 0.5s;
          transform-style: preserve-3d;
          transform: scale(1);
          padding: 20px;
          backface-visibility: hidden;
          border-radius: 5px;
          background: #ccc01cc9;
        }

        .memory-card.red {
          background: #b20606bd;
        }

        .memory-card.blue {
          background: #0631b2bd;
        }

        .memory-card.black {
          background: #000000bd;
        }

        .memory-card:active {
          transform: scale(0.97);
          transition: transform 0.2s;
        }

        .memory-card p {
          text-align: center;
          color: #333333;
        }

        .memory-card.black p {
          color: #ffffff;
        }

        @media screen and (max-width: 750px) and (max-height: 500px) {
          #__next {
            width: 50%;
            height: 90%;
          }

          .memory-card {
            width: calc(20% - 8px);
            height: calc(20% - 8px);
            margin: 4px;
            padding: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default Game;
