import classnames from 'classnames';
import { CSSProperties } from 'react';
import {
  areVotesVisible,
  areWordsVisible,
  Game,
  getRoundsCardVotes,
  isCardsColorVisible,
  isCardSelected,
  isMissCard,
  isMyVoteForCardInRound,
  toggleCard,
} from '../model/game';
import { Player } from '../model/player';
import { updateGame } from '../store/repository';
import { getUniqueSelectedCardStyle } from './styles/selectedCardStyler';

interface Props {
  player: Player;
  game: Game;
}

const Board = ({ player, game }: Props) => (
  <div className="flex-1 grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 grid-flow-row-dense">
    {game.board.map((card, cardIndex) => {
      const cardClasses = classnames(
        'p-4 pr-6 rounded-md shadow-sm space-y-2 break-words transform hover:-translate-y-1 transition-transform duration-500 ease-in-out',
        {
          [`bg-${card.color}`]: isCardsColorVisible(game, player, cardIndex),
          ['bg-unseen']: !isCardsColorVisible(game, player, cardIndex),
          [getUniqueSelectedCardStyle()]: isCardSelected(game, cardIndex),
          ['scale-125 z-10 border-2 border-pink-500']: isMyVoteForCardInRound(
            game,
            player,
            cardIndex
          ),
        }
      );
      const wordClasses = classnames('text-white', {
        'text-white': !isMissCard(game, cardIndex) || isCardsColorVisible(game, player, cardIndex),
        'text-gray-600': isMissCard(game, cardIndex) && isCardsColorVisible(game, player, cardIndex),
        'line-through': isCardSelected(game, cardIndex),
      });
      const wordStyle: CSSProperties = areVotesVisible(game, cardIndex)
        ? {
            margin: 0,
          }
        : {};

      return (
        <div
          onClick={() =>
            updateGame(game.name, (remoteGame) => toggleCard(remoteGame, player, cardIndex))
          }
          className={cardClasses}
          key={card.word}
        >
          {areVotesVisible(game, cardIndex) && (
            <span className="flex absolute h-6 w-6 right-0 top-0 -mr-3 -mt-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-pink-500 text-xs text-white pl-2 pt-1">
                {getRoundsCardVotes(game, cardIndex).length}
              </span>
            </span>
          )}
          {areWordsVisible(game) && (
            <p className={wordClasses} style={wordStyle}>
              {card.word}
            </p>
          )}
        </div>
      );
    })}
  </div>
);

export default Board;
