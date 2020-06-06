import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { oppositeTeamColor } from "../../src/model/color";
import {
  allTeamCards,
  Game,
  isBombCardSelected,
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

  const [game, setGame] = useState<Game | null | undefined>(undefined);
  useEffect(() => {
    if (!name) {
      return;
    }
    loadGame(name as string)
      .then(setGame)
      .then(() => watchGame(name as string, setGame));
  }, [name]);

  const [player, setPlayer] = useState<Player | null | undefined>(undefined);
  useEffect(() => {
    if (!game) {
      return;
    }
    loadPlayer(game).then(setPlayer);
  }, [game]);

  const [password, setPassword] = useState<string>("");

  if (game === undefined) {
    return <p>Momencik, już szukam tej gry w internetach...</p>;
  }

  if (player === undefined) {
    return <p>Już już, daj mi tylko sprawdzić ktoś ty jest...</p>;
  }

  if (game === null) {
    return <p>Nic nie wiem o tej grze :(</p>;
  }

  if (player === null || !isPlayerInTheGame(game, player)) {
    return <p>Ktoś ty?</p>;
  }

  if (isBombCardSelected(game)) {
    return !isPlayersRound(game, player) ? (
      <>
        <p className="text">Jesteś zwycięzcą!</p>
        <p className="text">Przeciwna drużyna zaznaczyła czarną kartę.</p>
      </>
    ) : (
      <>
        <p className="text">Przegraliście :(</p>
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
        <p className="text">Przegraliście :(</p>
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
            placeholder={game.roundsPassword[game.round] || 'Narzędzie 3'}
            disabled={game.roundsPassword[game.round].length > 0}
            value={password}
            onChange={(e) => {
              const password = e.target.value;
              setPassword(password);
            }}
          />
          <button
            type="button"
            disabled={game.roundsPassword[game.round].length > 0}
            onClick={() =>
              updateGame(game.name, (remoteGame) =>
                setRoundsPassword(remoteGame, password)
              )
            }
          >
            Zatwierdź hasło
          </button>
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
          Koniec rundy
        </button>
      )}

      <p className="text">
        {player.nick} jesteś
        {isGuesser(player) ? " zgadywaczem " : " liderem "}w drużynie
        {player.color === "red" ? " czerwonej." : " niebieskiej."}
      </p>
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

        .word-card {
          width: calc(20% - 10px);
          height: calc(20% - 10px);
          margin: 5px;
          display: flex;
          flex-direction: column;
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

        .word-card.red {
          background: #bf211eff;
        }

        .word-card.blue {
          background: #2274a5ff;
        }

        .word-card.miss {
          background: #ffc800ff;
        }

        .word-card.bomb {
          background: #0a100dff;
        }

        .word-card:active {
          transform: scale(0.97);
          transition: transform 0.2s;
        }

        .word-card p {
          text-align: center;
          color: #ffffffff;
          margin: 0;
        }

        .word-card p.selected {
          text-decoration: line-through;
        }

        .word-card p.voted-word {
          display: none;
        }

        .word-card p.voted-info {
          font-size: 0.85em;
        }

        .word-card.miss p {
          color: #000000ff;
        }

        @media screen and (max-width: 750px) and (max-height: 500px) {
          .word-card {
            width: calc(20% - 8px);
            height: calc(27% - 8px);
            margin: 3px;
          }

          .word-card p.voted {
            font-size: 0.65em;
          }
        }
      `}</style>
    </>
  );
};
