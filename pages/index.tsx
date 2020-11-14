import Link from 'next/link';
import ControlHeader from '../src/components/control.header';
import ControlContent from '../src/components/control.content';
import ControlFooter from '../src/components/control.footer';
import ControlMain from '../src/components/control.main';

export default () => {
  return (
    <>
      <ControlHeader title="Asy wywiadu" />
      <ControlContent>
        <ControlMain
          title="Witam w grze Asy Wywiadu"
          subtitle="Możesz tutaj stworzyć nową grę lub dołączyć do istniejącej"
        >
          <div className="grid grid-cols-2 grid-rows-1 gap-4 grid-flow-row-dense text-xl">
            <Link href="/create">
              <button className="bg-pink-500 hover:bg-pink-400 text-white py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded">
                Rozpocznij nową grę
              </button>
            </Link>

            <Link href="/join">
              <button className="bg-pink-500 hover:bg-pink-400 text-white py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded">
                Dołącz do gry
              </button>
            </Link>
          </div>
        </ControlMain>
        <ControlFooter />
      </ControlContent>
    </>
  );
};
