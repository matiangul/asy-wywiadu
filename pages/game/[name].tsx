import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Board from '../../src/components/board'
import { oppositeTeamColor } from '../../src/model/color'
import {
  allTeamCards,
  Game,
  isBombCardSelected,
  isPlayerInTheGame,
  isPlayersRound,
  selectedTeamCards,
  setRoundsPassword,
  voteForRoundEnd,
} from '../../src/model/game'
import { isGuesser, isLeader, Player } from '../../src/model/player'
import { loadGame, loadPlayer, updateGame, watchGame } from '../../src/store/repository'

export default () => {
  const router = useRouter()
  const { name } = router.query

  const [game, setGame] = useState<Game | null | undefined>(undefined)
  useEffect(() => {
    if (!name) {
      return
    }
    loadGame(name as string)
      .then(setGame)
      .then(() => watchGame(name as string, setGame))
  }, [name])

  const [player, setPlayer] = useState<Player | null | undefined>(undefined)
  useEffect(() => {
    if (!game) {
      return
    }
    loadPlayer(game).then(setPlayer)
  }, [game])

  const [password, setPassword] = useState<string>('')

  if (game === undefined) {
    return <p>Momencik, już szukam tej gry w internetach...</p>
  }

  if (player === undefined) {
    return <p>Już już, daj mi tylko sprawdzić ktoś ty jest...</p>
  }

  if (game === null) {
    return <p>Nic nie wiem o tej grze :(</p>
  }

  if (player === null || !isPlayerInTheGame(game, player)) {
    return <p>Ktoś ty?</p>
  }

  if (isBombCardSelected(game)) {
    return !isPlayersRound(game, player) ? (
      <>
        <p>Jesteś zwycięzcą!</p>
        <p>Przeciwna drużyna zaznaczyła czarną kartę.</p>
      </>
    ) : (
      <>
        <p>Przegraliście :(</p>
        <p>Niestety twoja drużyna zaznaczyła czarną kartę.</p>
      </>
    )
  }

  if (selectedTeamCards(game, player.color).length === allTeamCards(game, player.color).length) {
    return (
      <>
        <p>Jesteś zwycięzcą!</p>
        <p>Twoja drużyna ma już wszystkie wasze hasła.</p>
      </>
    )
  }

  if (
    selectedTeamCards(game, oppositeTeamColor(player.color)).length ===
    allTeamCards(game, oppositeTeamColor(player.color)).length
  ) {
    return (
      <>
        <p>Przegraliście :(</p>
        <p>Niestety przeciwna drużyna ma już wszystkie swoje hasła.</p>
      </>
    )
  }

  return (
    <>
      <div className="flex gap-2 p-16">
        <Board player={player} game={game} />
        <div className="w-1/4 bg-gray-100 rounded-sm shadow-sm text-gray-600 p-2">
          <p className="truncate">fasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfas</p>
          <p className="truncate">kl;fjaksdlf;ajkl;jkjfksdfisdfuisodfsjdklf</p>
        </div>
      </div>
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
              const password = e.target.value
              setPassword(password)
            }}
          />
          <button
            type="button"
            disabled={game.roundsPassword[game.round].length > 0}
            onClick={() =>
              updateGame(game.name, (remoteGame) => setRoundsPassword(remoteGame, password))
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
            updateGame(game.name, (remoteGame) => voteForRoundEnd(remoteGame, player))
          }}
        >
          Koniec rundy
        </button>
      )}
      <p>
        {player.nick} jesteś
        {isGuesser(player) ? ' zgadywaczem ' : ' liderem '}w drużynie
        {player.color === 'red' ? ' czerwonej.' : ' niebieskiej.'}
      </p>
      <p>
        Kolej na
        {isPlayersRound(game, player) ? ' twoją ' : ' drugą '}
        drużynę
      </p>
      <p>
        {isPlayersRound(game, player) ? 'Wasze ' : 'Ich '}
        hasło to: "{game.roundsPassword[game.round]}"
      </p>
    </>
  )
}
