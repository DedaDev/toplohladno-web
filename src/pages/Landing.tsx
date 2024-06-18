import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div className="bg-gray-800 font-sans text-white min-h-screen flex flex-col justify-center items-center">
      <main className="container max-w-screen-xl mx-auto flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Toplo hladno</h1>
        <p className="text-lg mb-4">
            Pogađajte zadate reči uz pomoć veštačke inteligencije
        </p>
        <Link
          to="/app"
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
            POKRENI IGRU
        </Link>
      </main>
      <footer className="w-full p-4 bg-gray-900 text-center">
        <p className="text-xs mb-2 text-gray-400">
              Naša aplikacija koristi podatke korisnika kako bi poboljšala tačnost rezultata.
              Vaša privatnost nam je veoma važna i svi podaci su zaštićeni u skladu sa našom politikom privatnosti.
        </p>
        <a className="text-blue-300 hover:underline text-xs" href="/privacy.html">
              Privacy Policy
        </a>
      </footer>
    </div>
  );
};
