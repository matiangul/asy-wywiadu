import Head from 'next/head'
import Link from 'next/link'

export default () => {
  return (
    <>
      <Head>
        <title>Asy wywiadu</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-center items-center min-h-screen bg-yellow-300 flex-col">
        <main>
          <h1 className="text-center text-5xl leading-tight">Witam w grze Asy Wywiadu</h1>
          <p className="text-center text-2xl mt-6">
            Możesz tutaj stworzyć nową grę lub dołączyć do istniejącej
          </p>

          <div className="flex-1 max-w-5xl p-16">
            <div className="grid grid-cols-2 grid-rows-1 gap-4 grid-flow-row-dense">
              <Link href="/create">
                <div className="p-4 pr-6 bg-white border-1-8 border-transparent rounded-md shadow-md space-y-2">
                  <h3>Rozpocznij nową grę</h3>
                  <p>Tutaj możesz stworzyć nową rozgrywkę dla swoich znajomych</p>
                </div>
              </Link>

              <Link href="/join">
                <div className="p-4 pr-6 bg-white border-1-8 border-transparent rounded-md shadow-md space-y-2">
                  <h3>Dołącz do gry</h3>
                  <p>Tutaj możesz dołączyć do już istniejącej rozgrywki</p>
                </div>
              </Link>
            </div>
          </div>
        </main>

        <footer>
          <a href="https://angulski.pl" target="_blank" rel="noopener noreferrer">
            Autor Mateusz Angulski
          </a>
        </footer>
      </div>
    </>
  )
}
