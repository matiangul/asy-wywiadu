import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import ControlContent from '../src/components/control.content';
import ControlFooter from '../src/components/control.footer';
import ControlHeader from '../src/components/control.header';
import ControlMain from '../src/components/control.main';
import InstructionLink from '../src/components/instruction.link';
import Share from '../src/components/share';
import { TeamColor } from '../src/model/color';
import { createGame, Game, startGame } from '../src/model/game';
import { wordsGenerator } from '../src/model/word';
import { createNewGame, updateGame } from '../src/store/repository';

const CreatePage = () => {
  const router = useRouter();
  const [startingColor, changeStartingColor] = useState<TeamColor>('red');
  const [restrictRoundTime, changeRestrictRoundTime] = useState<boolean>(false);
  const [roundTimeoutMin, changeRoundTimeoutMin] = useState<number>(3);
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
    createNewGame(
      createGame(wordsGenerator(25), startingColor, restrictRoundTime ? roundTimeoutMin * 60 : null)
    ).then(setGame);
  }, [startingColor, roundTimeoutMin, restrictRoundTime]);

  return (
    <>
      <ControlHeader title="Asy wywiadu - stwórz nową grę" />

      <ControlContent>
        <ControlMain title="Hej Asie" subtitle="Jesteś w trybie tworzenia nowej sprawy">
          <div className="grid grid-cols-2 grid-rows-1 gap-8 grid-flow-row-dense">
            <div>
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
              <div className="mt-2">
                <span className="text-gray-700">Ograniczyć czas trwania rundy?</span>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name="restrict"
                      checked={restrictRoundTime}
                      onChange={() => changeRestrictRoundTime(true)}
                    />
                    <span className="ml-2">Tak</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      className="form-radio"
                      name="restrict"
                      checked={!restrictRoundTime}
                      onChange={() => changeRestrictRoundTime(false)}
                    />
                    <span className="ml-2">Nie</span>
                  </label>
                </div>
              </div>
              {restrictRoundTime && (
                <div className="mt-2">
                  <label className="block mt-2">
                    <span className="text-gray-700">Ile minut ma trwać runda?</span>
                    <input
                      type="number"
                      min={1}
                      name="roundTimeoutMin"
                      className="form-input mt-1 block w-full border-2 rounded-md"
                      value={roundTimeoutMin}
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        const numeric = value.length > 0 ? parseInt(value, 10) : null;
                        changeRoundTimeoutMin(numeric);
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <Share disabled={!isCreated} gameName={game.name} />
              <p className="mt-2">A następnie:</p>
              <button
                disabled={!isCreated}
                onClick={start}
                className={`mt-2 bg-${startingColor} text-white py-2 px-4 border-b-4 border-${startingColor} hover:bg-opacity-75 rounded`}
              >
                Rozpocznij pracę nad sprawą
              </button>
            </div>
            <InstructionLink />
          </div>
        </ControlMain>
        <ControlFooter />
      </ControlContent>
    </>
  );
};

export default CreatePage;
