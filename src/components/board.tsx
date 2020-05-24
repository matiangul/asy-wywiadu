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
import classnames from "classnames";

interface Props {
  player: Player;
  game: Game;
}

export default ({ player, game }: Props) => (
  <>
    {game.board.map((card, cardIndex) => {
      const cardClasses = classnames("word-card", {
        [card.color]: isCardsColorVisible(game, player, cardIndex),
      });
      const cardAnimation = isCardSelected(game, cardIndex)
        ? getUniqueSelectedCardStyle()
        : areVotesVisible(game, cardIndex)
        ? getRotationForVotes(getCardVotesPerRound(game, cardIndex).length)
        : {};
      const wordClasses = classnames({
        selected: isCardSelected(game, cardIndex),
        "voted-word": areVotesVisible(game, cardIndex),
      });
      const votedInfoAnimation = getRotationForVotes(
        getCardVotesPerRound(game, cardIndex).length
      );

      return (
        <div
          onClick={() =>
            updateGame(game.name, (remoteGame) =>
              toggleCard(remoteGame, player, cardIndex)
            )
          }
          className={cardClasses}
          style={cardAnimation}
          key={card.word}
        >
          {areWordsVisible(game) && (
            <>
              <p className={wordClasses}>{card.word}</p>
              {areVotesVisible(game, cardIndex) && (
                <p className="voted-info" style={votedInfoAnimation}>
                  "{card.word}", głosy{" "}
                  {getCardVotesPerRound(game, cardIndex).length} z{" "}
                  {fellowGuessers(game.players, player).length}
                  {isMyVoteForCardInRound(game, player, cardIndex) &&
                    " w tym Ty"}
                </p>
              )}
            </>
          )}
        </div>
      );
    })}
  </>
);
