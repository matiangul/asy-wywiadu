import {
  areVotesVisible,
  areWordsVisible,
  Game,
  getCardVotesPerRound,
  isCardsColorVisible,
  toggleCard,
  isCardSelected,
  generateRandomInteger,
} from "../model/game";
import { Player } from "../model/player";
import { updateGame } from "../store/repository";

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
            ? {
                transform: `rotate(${generateRandomInteger(-9, 9)}deg)`,
              }
            : {}
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
