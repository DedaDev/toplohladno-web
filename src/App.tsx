import {useEffect, useState} from 'react'
import ReactGA from 'react-ga4';
import {Menu} from "./components/Menu.tsx";
import {WordInput} from "./components/WordInput.tsx";
import {useGetClue, useGetGameInstance} from "./api/toplohladno.ts";
import {GuessesList} from "./components/GuessesList.tsx";
import {getLocalGameId, setLocalGameId} from "./components/local.ts";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [gameId, setGameId] = useState<null | number>(getLocalGameId())
  const { gameInstance, mutate } = useGetGameInstance(gameId)
  const { clueArray } = useGetClue(gameId)

  ReactGA.initialize('G-ST09LH7B4T');

  useEffect(() => {
    if(gameInstance && gameId !== gameInstance.game_instance.id) {
      setGameId(gameInstance.game_instance.id)
      setLocalGameId(gameInstance.game_instance.id)
    }
  }, [gameInstance, gameId]);


  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GCLIENT}>
      <div className="bg-gray-800 font-jet">
        <main className="container max-w-screen-xl mx-auto min-h-screen flex flex-col justify-start">
          <div className="flex flex-col justify-between items-center h-screen text-white w-full">
            <div className="flex flex-col items-center w-[350px] mt-4">
              <div className="relative flex w-full justify-center items-center">
                <h1 className="text-2xl font-bold" style={{ letterSpacing: '0.2em'}}>{clueArray.join('').toUpperCase()}</h1>
                {gameInstance && <Menu resetInstance={mutate} gameInstance={gameInstance} />}
              </div>
              <div className="flex flex-col items-center w-full">
                {gameInstance && <WordInput resetInstance={mutate} gameInstance={gameInstance} />}
                {gameInstance && <GuessesList gameInstance={gameInstance} />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
