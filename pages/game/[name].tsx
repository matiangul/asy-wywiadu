import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Board from '../../src/components/board';
import Chat from '../../src/components/chat';
import ControlHeader from '../../src/components/control.header';
import FabIcon from '../../src/components/fab.icon';
import Panel from '../../src/components/panel';
import { oppositeTeamColor } from '../../src/model/color';
import {
  allTeamCards,
  Game,
  isBombCardSelected,
  isPlayerInTheGame,
  isPlayersRound,
  selectedTeamCards,
} from '../../src/model/game';
import { Player } from '../../src/model/player';
import { loadGame, loadPlayer, watchGame } from '../../src/store/repository';

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
        <p>Jesteś zwycięzcą!</p>
        <p>Przeciwna drużyna zaznaczyła czarną kartę.</p>
      </>
    ) : (
      <>
        <p>Przegraliście :(</p>
        <p>Niestety twoja drużyna zaznaczyła czarną kartę.</p>
      </>
    );
  }

  if (selectedTeamCards(game, player.color).length === allTeamCards(game, player.color).length) {
    return (
      <>
        <p>Jesteś zwycięzcą!</p>
        <p>Twoja drużyna ma już wszystkie wasze hasła.</p>
      </>
    );
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
    );
  }

  return (
    <div className="relative bg-beige font-serif h-screen">
      <ControlHeader title={game.name} />
      <div className="lg:grid lg:grid-cols-4 lg:gap-4">
        <div className="lg:col-span-3 lg:gap-0 pl-8 pt-8 pb-8 lg:pr-0 pr-8">
          <Board player={player} game={game} />
          <Panel
            className="hidden lg:block w-full bg-gray-100 rounded-md shadow-md text-gray-600 p-4 mt-8"
            player={player}
            game={game}
          />
        </div>
        <Chat className="hidden lg:flex h-screen pr-8 pt-8 pb-8" />
      </div>
      <button
        onClick={() => {
          setPanelVisibility(!isPanelOpen);
          setChatVisibility(false);
        }}
        className="fixed right-0 bottom-0 mr-2 mb-2 z-10 lg:hidden w-12 h-12 bg-blue rounded-full text-white flex items-center justify-center focus:outline-none focus:shadow-outline"
      >
        <FabIcon />
      </button>
      <button
        onClick={() => {
          setChatVisibility(!isChatOpen);
          setPanelVisibility(false);
        }}
        className="fixed right-0 bottom-0 mr-2 mb-16 z-10 lg:hidden w-12 h-12 bg-red rounded-full text-white flex items-center justify-center focus:outline-none focus:shadow-outline"
      >
        <FabIcon />
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
        <Chat className="fixed lg:hidden w-5/6 bottom-0 right-0 mb-24 mr-12 rounded-md bg-gray-100 text-gray-600 h-4/5" />
      )}
    </div>
  );
};

export default GamePage;
