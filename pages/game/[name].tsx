import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { oppositeTeamColor } from "../../src/model/color";
import {
  allTeamCards,
  Game,
  isBlackCardSelected,
  isPlayerInTheGame,
  isPlayersRound,
  selectedTeamCards,
  setRoundsPassword,
  voteForRoundEnd,
} from "../../src/model/game";
import { Player, isLeader, isGuesser } from "../../src/model/player";
import {
  loadGame,
  loadPlayer,
  watchGame,
  updateGame,
} from "../../src/store/repository";
import Board from "../../src/components/board";

export default () => {
  const router = useRouter();
  const { name } = router.query;

  const [game, setGame] = useState<Game | null>(null);
  useEffect(() => {
    if (name) {
      loadGame(name as string)
        .then(setGame)
        .then(() => watchGame(name as string, setGame));
    }
  }, [name]);

  const [player, setPlayer] = useState<Player | null>(null);
  useEffect(() => {
    if (name) {
      loadPlayer(name as string).then(setPlayer);
    }
  }, [name]);

  if (!game) {
    return <p>Nic nie wiem o tej grze :(</p>;
  }

  if (!player || !isPlayerInTheGame(game, player)) {
    return <p>Ktoś ty?</p>;
  }

  if (isBlackCardSelected(game)) {
    return !isPlayersRound(game, player) ? (
      <>
        <p className="text">Jesteś zwycięzcą!</p>
        <p className="text">Przeciwna drużyna zaznaczyła czarną kartę.</p>
      </>
    ) : (
      <>
        <p className="text">Pregraliście :(</p>
        <p className="text">Niestety twoja drużyna zaznaczyła czarną kartę.</p>
      </>
    );
  }

  if (
    selectedTeamCards(game, player.color).length ===
    allTeamCards(game, player.color).length
  ) {
    return (
      <>
        <p className="text">Jesteś zwycięzcą!</p>
        <p className="text">Twoja drużyna ma już wszystkie wasze hasła.</p>
      </>
    );
  }

  if (
    selectedTeamCards(game, oppositeTeamColor(player.color)).length ===
    allTeamCards(game, oppositeTeamColor(player.color)).length
  ) {
    return (
      <>
        <p className="text">Pregraliście :(</p>
        <p className="text">
          Niestety przeciwna drużyna ma już wszystkie swoje hasła.
        </p>
      </>
    );
  }

  return (
    <>
      <Board player={player} game={game} />

      {isLeader(player) && isPlayersRound(game, player) && (
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

      {isGuesser(player) && isPlayersRound(game, player) && (
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
        {isPlayersRound(game, player) ? " twoją " : " drugą "}
        drużynę
      </p>
      <p className="text">
        {isPlayersRound(game, player) ? "Wasze " : "Ich "}
        hasło to: "{game.roundsPassword[game.round]}"
      </p>

      <style jsx global>{`
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

        .word-card {
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

        .word-card.red {
          background: #b20606bd;
        }

        .word-card.blue {
          background: #0631b2bd;
        }

        .word-card.yellow {
          background: yellow;
        }

        .word-card.black {
          background: #000000bd;
        }

        .word-card:active {
          transform: scale(0.97);
          transition: transform 0.2s;
        }

        .word-card p {
          text-align: center;
          color: #333333;
        }

        .word-card.black p {
          color: #ffffff;
        }

        @media screen and (max-width: 750px) and (max-height: 500px) {
          #__next {
            width: 50%;
            height: 90%;
          }

          .word-card {
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
