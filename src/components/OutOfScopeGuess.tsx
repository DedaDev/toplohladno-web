import { FC } from 'react'
import { GuessBar } from './GuessBar.tsx'
import {MAX_GUESSES_TO_SHOW} from "./static.ts";
import {IGameInstance} from "../types.ts";
import {useGetGameGuesses} from "../api/toplohladno.ts";
import {cyrilicToLatin} from "serbian-script-converter";

interface OutOfScopeGuessProps {
  gameInstance: IGameInstance
}
export const OutOfScopeGuess: FC<OutOfScopeGuessProps> = ({ gameInstance }) => {
  const { guesses = [] } = useGetGameGuesses(gameInstance?.game_instance?.id)

  const hasMaxGuesses = guesses.length === MAX_GUESSES_TO_SHOW
  if (!hasMaxGuesses || !gameInstance.game_instance.last_guess) return
  const lastGuessNotInBest = guesses[guesses.length - 1].similarity_rank < gameInstance.game_instance.last_guess.similarity_rank
  if (!lastGuessNotInBest) return

  return (
    <div className="animate-fadeOut" key={cyrilicToLatin(gameInstance.game_instance.last_guess.word.word)}>
      <GuessBar gameInstance={gameInstance} highlighted={true} guess={gameInstance.game_instance.last_guess} />
    </div>
  )
}
