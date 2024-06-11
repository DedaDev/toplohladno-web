import {Clue} from "./Clue.tsx";
import {FC} from "react";
import {IGameInstance} from "../types.ts";
import {GuessBar} from "./GuessBar.tsx";
import {useGetGameGuesses} from "../api/toplohladno.ts";
import {OutOfScopeGuess} from "./OutOfScopeGuess.tsx";

export const GuessesList: FC<{ gameInstance: IGameInstance }> = ({ gameInstance }) => {
  const { guesses = [] } = useGetGameGuesses(gameInstance?.game_instance?.id)

  if(!gameInstance) return
  return <div className="flex flex-col mt-2 w-full gap-2">
    {guesses.length === 0 && <Clue clue={gameInstance.game_instance.final_word.human_clue}/>}
    {guesses.map((guess) => (
      <GuessBar highlighted={guess.word.word === gameInstance?.game_instance?.last_guess?.word?.word} key={guess.word_id} guess={guess} />
    ))}
    <OutOfScopeGuess gameInstance={gameInstance} />
  </div>
}