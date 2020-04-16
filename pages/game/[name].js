import Error from "next/error";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Game = () => {
  const router = useRouter();
  const { name } = router.query;

  const [game, setGame] = useState(null);
  useEffect(() => {
    setGame(JSON.parse(sessionStorage.getItem(name)));
  }, [name]);

  if (!game) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      {game.board.map(({ color, word }) => (
        <div className="memory-card" data-name="react" key={word}>
          <div className={`front-face ${color}`}></div>
          <div className="back-face">{word}</div>
        </div>
      ))}

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

        body.blue {
          background: #0631b2bd;
        }

        body.red {
          background: #0631b2bd;
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
        }

        .memory-card.flip {
          transform: rotateY(180deg);
        }

        .memory-card:active {
          transform: scale(0.97);
          transition: transform 0.2s;
        }

        .front-face,
        .back-face {
          width: 100%;
          height: 100%;
          padding: 20px;
          position: absolute;
          backface-visibility: hidden;
          border-radius: 5px;
          background: #ccc01cc9;
        }

        .front-face {
          transform: rotateY(180deg);
        }

        .front-face.red {
          background: #cc1c1cd6;
        }

        .front-face.blue {
          background: #1c71ccde;
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
          }

          .front-face,
          .back-face {
            padding: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default Game;
