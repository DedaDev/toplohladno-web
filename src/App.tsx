import {useEffect, useState} from 'react'
import ReactGA from 'react-ga4';
import {getGameState, ILocalState} from "./components/local.ts";
import {Menu} from "./components/Menu.tsx";
import {GameWinScreen} from "./components/GameWinScreen.tsx";
import {WordInput} from "./components/WordInput.tsx";
import TextWithNewLine from "./components/TextWithNewLine.tsx";
import {GuessBar} from "./components/GuessBar.tsx";
import {OutOfScopeGuess} from "./components/OutOfScopeGuess.tsx";
import {Clue} from "./components/Clue.tsx";

function App() {
    const [gameState, setGameState] = useState<ILocalState | null>(null)
    const [message, setMessage] = useState('')

    console.log(1)

    ReactGA.initialize('G-ST09LH7B4T');

    async function resetGameState() {
        const state = await getGameState()
        setGameState(state)
    }

    useEffect(() => {
        resetGameState()
    }, [])

    if (!gameState) return

    const isWinScreen = gameState.best_guesses.length !== 0 && gameState.best_guesses[0].score === 0
    return (
        <div className="bg-gray-800 font-jet">
            <main className="container max-w-screen-xl mx-auto min-h-screen flex flex-col justify-start">
                <div className="flex flex-col justify-between items-center h-screen text-white w-full">
                    <div className="flex flex-col items-center w-[350px] mt-4">
                        <div className="relative flex w-full justify-center items-center">
                            <h1 className="text-2xl font-bold">TOPLO-HLADNO</h1>
                            <Menu resetGameState={resetGameState} gameState={gameState} />
                        </div>
                        {isWinScreen && <GameWinScreen gameState={gameState} resetGameState={resetGameState} />}
                        {!isWinScreen && (
                            <div className="flex flex-col items-center mt-4 w-full">
                                <WordInput gameState={gameState} resetGameState={resetGameState} setMessage={setMessage} />
                                <div className="text-gray-400 text-sm mt-2">
                                    <TextWithNewLine text={message} />
                                </div>
                                <div className="flex flex-col mt-2 w-full gap-2">
                                    {gameState.best_guesses.length === 0 && <Clue clue={gameState.human_clue}/>}
                                    {gameState.best_guesses.map((guess) => (
                                        <GuessBar highlighted={guess.word === gameState?.last_guess?.word} key={guess.word} guess={guess} />
                                    ))}
                                    <OutOfScopeGuess game_state={gameState} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default App
