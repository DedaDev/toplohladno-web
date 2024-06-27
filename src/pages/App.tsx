import {useEffect, useState} from 'react'
import ReactGA from 'react-ga4';
import {Menu} from "../components/Menu.tsx";
import {WordInput} from "../components/WordInput.tsx";
import {useGetClue, useGetGameInstance} from "../api/toplohladno.ts";
import {GuessesList} from "../components/GuessesList.tsx";
import {getLocalGameId, setLocalGameId} from "../components/local.ts";
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthProviderWrapper from "../hooks/AuthProviderWrapper.tsx";
import {SolvedModal} from "../components/modals/SolvedModal.tsx";
import {GiveUpModal} from "../components/modals/GiveUpModal.tsx";
import 'react-simple-keyboard/build/css/index.css';
import {TouchInput} from "../components/TouchInput.tsx";

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
    <AuthProviderWrapper>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GCLIENT}>
        <div className="bg-gray-800 w-screen-xl min-h-screen font-jet flex flex-col justify-between">
          <main className="container mx-auto lex flex-col justify-start">
            <div className="flex flex-col justify-between items-center text-white w-full">
              <div className="flex flex-col items-center w-[350px] mt-8">
                <div className="relative flex w-full justify-center items-center mb-4">
                  {gameInstance && gameInstance.guesses_count > 5 &&
                      <p className="absolute left-0 text-xs mb-2 text-gray-500 md:hidden">Pokušaj {gameInstance.guesses_count}</p>
                  }
                  <h1 className="text-2xl font-bold" style={{ letterSpacing: '0.2em'}}>{clueInfo.partialWord.join('').toUpperCase()}</h1>
                  {gameInstance && <Menu resetInstance={mutate} gameInstance={gameInstance} />}
                </div>
                {gameInstance && <div className="flex flex-col items-center w-full">
                  <WordInput gameInstance={gameInstance} resetInstance={mutate} />
                  <GuessesList gameInstance={gameInstance} />
                  <SolvedModal gameInstance={gameInstance} resetInstance={mutate} />
                  <GiveUpModal gameInstance={gameInstance} resetInstance={mutate} />
                  <TouchInput gameInstance={gameInstance} resetInstance={mutate} />
                </div>}
              </div>
            </div>
          </main>
        </div>
      </GoogleOAuthProvider>
    </AuthProviderWrapper>
  )
}

export default App
