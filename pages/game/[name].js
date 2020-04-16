import Error from "next/error";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Board from "../../src/board";

const Game = () => {
  const router = useRouter();
  const { name } = router.query;

  const [game, setGame] = useState(null);
  useEffect(() => setGame(JSON.parse(sessionStorage.getItem(name))), [name]);

  const [player, setPlayer] = useState(null);
  useEffect(
    () => setPlayer(JSON.parse(sessionStorage.getItem(`player-${name}`))),
    [name]
  );

  if (!game) {
    return <Error statusCode={404} />;
  }

  if (!player) {
    return <p>Who are you?</p>;
  }

  return (
    <>
      <Board role={player.role} board={game.board} />

      {player.role === "leader" && (
        <>
          <p>Wpisz hasło dla swojej drużyny</p>
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
                sessionStorage.setItem(
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

      <p className="text">
        Kolej na drużynę{" "}
        {game.roundsColor[game.round] === "red" ? "czerwonych" : "niebieskich"}
      </p>
      <p className="text">{`Wasze hasło to: "${
        game.roundsPassword[game.round]
      }"`}</p>

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

        .memory-card:active {
          transform: scale(0.97);
          transition: transform 0.2s;
        }

        .memory-card p {
          text-align: center;
          color: #333333;
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
