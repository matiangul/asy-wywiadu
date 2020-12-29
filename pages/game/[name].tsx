import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Board from '../../src/components/board';
import Chat from '../../src/components/chat';
import ControlHeader from '../../src/components/control.header';
import FabChatIcon from '../../src/components/fab.chat.icon';
import FabPanelIcon from '../../src/components/fab.panel.icon';
import Panel from '../../src/components/panel';
import { oppositeTeamColor } from '../../src/model/color';
import {
  allTeamCards,
  Game,
  isBombCardSelected,
  isPlayerInTheGame,
  isPlayersRound,
  isRoundOver,
  nextRound,
  roundsColor,
  selectedTeamCards,
} from '../../src/model/game';
import { isLeader, Player } from '../../src/model/player';
import { loadGame, loadPlayer, updateGame, watchGame } from '../../src/store/repository';

const GamePage = () => {
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

  const [isPanelOpen, setPanelVisibility] = useState<boolean>(false);
  const [isChatOpen, setChatVisibility] = useState<boolean>(false);

  useEffect(() => {
    const isRoundsLeader = () => game && player && isLeader(player) && isPlayersRound(game, player);

    if (isRoundsLeader()) {
      const interval = setInterval(() => {
        if (game && isRoundOver(game)) {
          updateGame(game.name, (remoteGame) => nextRound(remoteGame));
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [game, player]);

  if (game === undefined) {
    return <p>Momencik, już szukam tej sprawy...</p>;
  }

  if (player === undefined) {
    return <p>Już już, daj mi tylko sprawdzić ktoś ty jest...</p>;
  }

  if (game === null) {
    return <p>Nic nie wiem o tej sprawie :(</p>;
  }

  if (player === null || !isPlayerInTheGame(game, player)) {
    return <p>Ktoś ty?</p>;
  }

  if (isBombCardSelected(game)) {
    return !isPlayersRound(game, player) ? (
      <div className="h-screen text-center">
        <p className="mt-16 text-9xl animate-bounce">🎉</p>
        <p className="mt-8 text-4xl">Jesteś zwycięzcą!</p>
        <p className="text-2xl">Przeciwny zespół odkrył zakazane hasło.</p>
      </div>
    ) : (
      <div className="h-screen text-center">
        <p className="mt-16 text-9xl animate-bounce">💣</p>
        <p className="mt-8 text-4xl">Przegraliście!</p>
        <p className="text-2xl">Niestety twój zespół okrył zakazane hasło.</p>
      </div>
    );
  }

  if (selectedTeamCards(game, player.color).length === allTeamCards(game, player.color).length) {
    return (
      <div className="h-screen text-center">
        <p className="mt-16 text-9xl animate-bounce">🎉</p>
        <p className="mt-8 text-4xl">Jesteś zwycięzcą!</p>
        <p className="text-2xl">Twój zespół odgadł wszystkie hasła.</p>
      </div>
    );
  }

  if (
    selectedTeamCards(game, oppositeTeamColor(player.color)).length ===
    allTeamCards(game, oppositeTeamColor(player.color)).length
  ) {
    return (
      <div className="h-screen text-center">
        <p className="mt-16 text-9xl animate-bounce">💣</p>
        <p className="mt-8 text-4xl">Przegraliście!</p>
        <p className="text-2xl">Niestety przeciwny zespół odgadł już wszystkie swoje hasła.</p>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen bg-${roundsColor(game)} bg-opacity-40`}>
      <ControlHeader title={game.name} />
      <div className="lg:grid lg:grid-cols-4 lg:gap-4">
        <div className="lg:col-span-3 lg:gap-0 pl-4 pt-4 pb-4 lg:pr-0 pr-4">
          <Board player={player} game={game} />
          <Panel
            className="hidden lg:block w-full bg-gray-100 rounded-md shadow-md text-gray-600 p-4 mt-4"
            player={player}
            game={game}
          />
        </div>
        <Chat className="hidden lg:flex h-screen fixed w-1/4 top-0 right-0 p-4" game={game} player={player} />
      </div>
      <button
        onClick={() => {
          setPanelVisibility(!isPanelOpen);
          setChatVisibility(false);
        }}
        className="fixed right-0 bottom-0 mr-2 mb-2 z-10 lg:hidden w-12 h-12 bg-gray-600 rounded-full text-white flex items-center justify-center focus:outline-none focus:shadow-outline"
      >
        <FabPanelIcon />
      </button>
      <button
        onClick={() => {
          setChatVisibility(!isChatOpen);
          setPanelVisibility(false);
        }}
        className="fixed right-0 bottom-0 mr-2 mb-16 z-10 lg:hidden w-12 h-12 bg-gray-600 rounded-full text-white flex items-center justify-center focus:outline-none focus:shadow-outline"
      >
        <FabChatIcon />
      </button>
      {(isPanelOpen || isChatOpen) && (
        <button
          onClick={() => {
            setPanelVisibility(false);
            setChatVisibility(false);
          }}
          tabIndex={-1}
          className="fixed lg:hidden inset-0 h-full w-full bg-black opacity-50 cursor-default"
        ></button>
      )}
      {isPanelOpen && (
        <Panel
          className="fixed lg:hidden w-5/6 bottom-0 right-0 mb-10 mr-12 rounded-md bg-gray-100 text-gray-600 p-4"
          player={player}
          game={game}
        />
      )}
      {isChatOpen && (
        <Chat
          className="fixed lg:hidden w-5/6 bottom-0 right-0 mb-24 mr-12 rounded-md bg-gray-100 text-gray-600 h-4/5"
          game={game}
          player={player}
        />
      )}
    </div>
  );
};

export default GamePage;
