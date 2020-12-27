import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import ControlContent from '../src/components/control.content';
import ControlFooter from '../src/components/control.footer';
import ControlHeader from '../src/components/control.header';
import ControlMain from '../src/components/control.main';
import Share from '../src/components/share';
import { TeamColor } from '../src/model/color';
import { createGame, Game, startGame } from '../src/model/game';
import { wordsGenerator } from '../src/model/word';
import { createNewGame, updateGame } from '../src/store/repository';

const  CreatePage = () => {
  const router = useRouter();
  const [startingColor, changeStartingColor] = useState<TeamColor>('red');
  const emptyGame = { name: null };
  const [game, setGame] = useState<Partial<Game>>(emptyGame);
  const changeWhoStarts = (e: ChangeEvent<HTMLInputElement>) => {
    changeStartingColor(e.target.value as TeamColor);
  };
  const isCreated = !!game.name;
  const start = () => {
    updateGame(game.name, (remoteGame) => startGame(remoteGame)).then(() =>
      router.push(`/join?name=${game.name}`)
    );
  };

  useEffect(() => {
    setGame(emptyGame);
    createNewGame(createGame(wordsGenerator(25), startingColor)).then(setGame);
  }, [startingColor]);

  return (
    <>
      <ControlHeader title="Asy wywiadu - stwórz nową grę" />

      <ControlContent>
        <ControlMain title="Hej Asie" subtitle="Jesteś w trybie tworzenia nowej sprawy">
          <div className="grid grid-cols-3 grid-rows-1 gap-8 grid-flow-row-dense">
            <div className="text-right">
              <span className="tex-2xl">Kto zaczyna?</span>
              <div className="mt-2">
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue"
                      value="blue"
                      checked={startingColor === 'blue'}
                      onChange={changeWhoStarts}
                    />
                    <span className="ml-2">Niebiescy</span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-red"
                      value="red"
                      checked={startingColor === 'red'}
                      onChange={changeWhoStarts}
                    />
                    <span className="ml-2">Czerwoni</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col col-span-2">
              {isCreated && (
                <>
                  <Share gameName={game.name} />
                  <p className="mt-2">A następnie:</p>
                  <button
                    onClick={start}
                    className={`mt-2 bg-${startingColor} text-white py-2 px-4 border-b-4 border-${startingColor} hover:bg-opacity-75 rounded`}
                  >
                    Rozpocznij grę
                  </button>
                </>
              )}
              {!isCreated && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              )}
            </div>
          </div>
        </ControlMain>
        <ControlFooter />
      </ControlContent>
    </>
  );
};

export default CreatePage;
