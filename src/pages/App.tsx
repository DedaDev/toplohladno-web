import {useEffect, useState} from 'react'
import ReactGA from 'react-ga4';
import {Menu} from "../components/Menu.tsx";
import {WordInput} from "../components/WordInput.tsx";
import {useGetClue, useGetGameInstance} from "../api/toplohladno.ts";
import {GuessesList} from "../components/GuessesList.tsx";
import {getLocalGameId, setLocalGameId} from "../components/local.ts";
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthProvider from "../hooks/AuthContext.tsx";

function App() {
  const [gameId, setGameId] = useState<null | number>(getLocalGameId())
  const { gameInstance, mutate } = useGetGameInstance(gameId)
  const { clueInfo } = useGetClue(gameId)

  ReactGA.initialize(import.meta.env.VITE_ANALYTICS_KEY);

  useEffect(() => {
    if(gameInstance && gameId !== gameInstance.game_instance.id) {
      setGameId(gameInstance.game_instance.id)
      setLocalGameId(gameInstance.game_instance.id)
    }
  }, [gameInstance, gameId]);


  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GCLIENT}>
        <div className="bg-gray-800 w-screen-xl min-h-screen font-jet flex flex-col justify-between">
          <main className="container mx-auto lex flex-col justify-start">
            <div className="flex flex-col justify-between items-center text-white w-full">
              <div className="flex flex-col items-center w-[350px] mt-4">
                <div className="relative flex w-full justify-center items-center">
                  <h1 className="text-2xl font-bold" style={{ letterSpacing: '0.2em'}}>{clueInfo.partialWord.join('').toUpperCase()}</h1>
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
    </AuthProvider>
  )
}

export default App