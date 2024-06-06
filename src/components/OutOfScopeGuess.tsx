import { FC } from 'react'
import { GuessBar } from './GuessBar.tsx'
import {ILocalState} from "./local.ts";
import {MAX_GUESSES_TO_SHOW} from "./static.ts";

interface OutOfScopeGuessProps {
  game_state: ILocalState
}
export const OutOfScopeGuess: FC<OutOfScopeGuessProps> = ({ game_state }) => {
  const hasMaxGuesses = game_state.best_guesses.length === MAX_GUESSES_TO_SHOW
  if (!hasMaxGuesses || !game_state.last_guess) return
  const lastGuessNotInBest = game_state.best_guesses[game_state.best_guesses.length - 1].score < game_state.last_guess.score
  if (!lastGuessNotInBest) return

  return (
    <div className="animate-fadeOut" key={game_state.last_guess.word}>
      <GuessBar highlighted={true} guess={game_state.last_guess} />
    </div>
  )
}
