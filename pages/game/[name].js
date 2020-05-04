import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Board from "../../src/board";
import {
  arePlayersSame,
  voteForRoundEnd,
  selectedCards,
  oppositeColor,
  setRoundsPassword,
} from "../../src/game";
import { updateGame, loadGame, loadPlayer, watchGame } from "../../src/store";

const Game = () => {
  const router = useRouter();
  const { name } = router.query;
  // game state
  const [game, setGame] = useState(null);
  useEffect(() => {
    if (name) {
      loadGame(name).then(setGame).then(watchGame(name, setGame));
    }
  }, [name]);
  // load player
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    if (name) {
      loadPlayer(name).then(setPlayer);
    }
  }, [name]);

  const selectedBombCard = selectedCards(game).find(
    ({ color }) => "bomb" === color
  );
  if (game && player && selectedBombCard) {
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

  const myColorSelectedCards =
    game && player
      ? selectedCards(game).filter(({ color }) => player.color === color)
      : [];
  const myColorCards =
    game && player
      ? game.board.filter(({ color }) => player.color === color)
      : [];
  if (
    myColorSelectedCards.length === myColorCards.length &&
    myColorCards.length > 0
  ) {
    return (
      <>
        <p className="text">Jesteś zwycięzcą!</p>
        <p>Twoja drużyna ma już wszystkie wasze hasła.</p>
      </>
    );
  }

  const oppositeColorSelectedCards =
    game && player
      ? selectedCards(game).filter(
          ({ color }) => oppositeColor(player.color) === color
        )
      : [];
  const oppositeColorCards =
    game && player
      ? game.board.filter(({ color }) => oppositeColor(player.color) === color)
      : [];
  if (
    oppositeColorSelectedCards.length === oppositeColorCards.length &&
    oppositeColorCards.length > 0
  ) {
    return (
      <>
        <p className="text">Pregraliście :(</p>
        <p>Niestety przeciwna drużyna ma już wszystkie swoje hasła.</p>
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
                updateGame(game.name, (remoteGame) =>
                  setRoundsPassword(remoteGame, password)
                );
              }}
            />
          </>
        )}

      {player.role === "guesser" &&
        player.color === game.roundsColor[game.round] && (
          <button
            type="button"
            onClick={() => {
              updateGame(game.name, (remoteGame) =>
                voteForRoundEnd(remoteGame, player)
              );
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
          background: #ffffff;
        }

        #__next {
          width: 90vw;
          height: 70vh;
          margin: 5vh auto;
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
          display: flex;
          align-items: center;
          justify-content: center;
          word-break: break-word;
          position: relative;
          transition: all 0.5s;
          transform-style: preserve-3d;
          transform: scale(1);
          border-radius: 3px;
          background: rgba(77, 139, 49, 1);
        }

        .memory-card.red {
          background: #bf211eff;
        }

        .memory-card.blue {
          background: #2274a5ff;
        }

        .memory-card.miss {
          background: #ffc800ff;
        }

        .memory-card.bomb {
          background: #0a100dff;
        }

        .memory-card:active {
          transform: scale(0.97);
          transition: transform 0.2s;
        }

        .memory-card p {
          text-align: center;
          color: #ffffffff;
          margin: 0;
        }

        .memory-card.miss p {
          color: #000000ff;
        }

        @media screen and (max-width: 750px) and (max-height: 500px) {
          .memory-card {
            width: calc(20% - 8px);
            height: calc(20% - 8px);
            margin: 3px;
          }
        }
      `}</style>
    </>
  );
};

export default Game;
