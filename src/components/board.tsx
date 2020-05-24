import {
  areVotesVisible,
  areWordsVisible,
  Game,
  getCardVotesPerRound,
  isCardsColorVisible,
  isCardSelected,
  toggleCard,
} from "../model/game";
import { Player } from "../model/player";
import { updateGame } from "../store/repository";
import { getUniqueSelectedCardStyle } from "./styles/selectedCardStyler";

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
          isCardSelected(game, cardIndex) ? getUniqueSelectedCardStyle() : {}
        }
        key={card.word}
      >
        {areWordsVisible(game) && (
          <p className={isCardSelected(game, cardIndex) ? `selected` : ""}>
            {card.word}
            {areVotesVisible(game, cardIndex) &&
              ".".repeat(getCardVotesPerRound(game, cardIndex).length)}
          </p>
        )}
      </div>
    ))}
  </>
);
