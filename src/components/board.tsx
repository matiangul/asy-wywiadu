import classnames from 'classnames'
import { CSSProperties } from 'react'
import {
  areVotesVisible,
  areWordsVisible,
  Game,
  getCardVotesPerRound,
  isCardsColorVisible,
  isCardSelected,
  isMyVoteForCardInRound,
  toggleCard,
} from '../model/game'
import { fellowGuessers, Player } from '../model/player'
import { updateGame } from '../store/repository'
import { getUniqueSelectedCardStyle } from './styles/selectedCardStyler'

interface Props {
  player: Player
  game: Game
}

export default ({ player, game }: Props) => (
  <>
    <div className="grid grid-cols-5 gap-4 grid-flow-row-dense">
      {game.board.map((card, cardIndex) => {
        const cardClasses = classnames(
          'p-4 pr-6 rounded-md shadow-md space-y-2 break-words transform hover:-translate-y-1 transition-transform duration-500 ease-in-out',
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
        )
        const wordClasses = classnames('text-white', {
          'line-through': isCardSelected(game, cardIndex),
        })
        const wordStyle: CSSProperties = areVotesVisible(game, cardIndex)
          ? {
              margin: 0,
            }
          : {}

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
                  {getCardVotesPerRound(game, cardIndex).length}
                </span>
              </span>
            )}
            {areWordsVisible(game) && (
              <p className={wordClasses} style={wordStyle}>
                {card.word}
              </p>
            )}
          </div>
        )
      })}
    </div>
  </>
)
