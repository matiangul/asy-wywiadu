import {
  areVotesVisible,
  areWordsVisible,
  Game,
  getCardVotesPerRound,
  isCardsColorVisible,
  isCardSelected,
  toggleCard,
  isMyVoteForCardInRound,
} from "../model/game";
import { Player, fellowGuessers } from "../model/player";
import { updateGame } from "../store/repository";
import {
  getUniqueSelectedCardStyle,
  getRotationForVotes,
} from "./styles/selectedCardStyler";

interface Props {
  player: Player;
  game: Game;
}

export default ({ player, game }: Props) => (
  <>
    {game.board.map((card, cardIndex) => (
      <div
        onClick={() =>
          updateGame(game.name, (remoteGame) =>
            toggleCard(remoteGame, player, cardIndex)
          )
        }
        className={`word-card ${
          isCardsColorVisible(game, player, cardIndex) ? card.color : ""
        }`}
        style={
          isCardSelected(game, cardIndex)
            ? getUniqueSelectedCardStyle()
            : areVotesVisible(game, cardIndex)
            ? getRotationForVotes(getCardVotesPerRound(game, cardIndex).length)
            : {}
        }
        key={card.word}
      >
        {areWordsVisible(game) && (
          <>
            <p
              className={
                isCardSelected(game, cardIndex)
                  ? "selected"
                  : areVotesVisible(game, cardIndex)
                  ? "voted-word"
                  : ""
              }
            >
              {card.word}
            </p>
            {areVotesVisible(game, cardIndex) && (
              <p
                className="voted-info"
                style={getRotationForVotes(
                  getCardVotesPerRound(game, cardIndex).length
                )}
              >
                "{card.word}", głosy{" "}
                {getCardVotesPerRound(game, cardIndex).length} z{" "}
                {fellowGuessers(game.players, player).length}
                {isMyVoteForCardInRound(game, player, cardIndex) && " w tym Ty"}
              </p>
            )}
          </>
        )}
      </div>
    ))}
  </>
);
