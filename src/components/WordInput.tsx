import { useForm } from 'react-hook-form'
import { FC } from 'react'
import { cyrilicToLatin } from 'serbian-script-converter'
import {toplohladnoInstance} from "../api/toplohladno.ts";
import {IGuessResponse } from "./static.ts";
import {ILocalState, pushGuessToState} from "./local.ts";
import ReactGA from "react-ga4";

interface InputProps {
  query: string
}

interface IWordInputProps {
  gameState: ILocalState
  resetGameState: () => void
  setMessage: (msg: string) => void
}
export const WordInput: FC<IWordInputProps> = ({ gameState, resetGameState, setMessage }) => {
  const { register, handleSubmit, reset } = useForm<InputProps>()

  async function onSubmit(props: InputProps) {
    try {
      const query = props.query.trim().toLowerCase()
      const data: IGuessResponse = await toplohladnoInstance
        .post('/guess', { query, word_id: gameState.word_id })
        .then((res) => res.data)
      reset()
      if (data.valid && data.score !== undefined) {
        ReactGA.event({
          category: 'guess_category',
          action: 'guess_action',
          label: 'guess_label'
        })
        await pushGuessToState({
          score: data.score,
          word: cyrilicToLatin(data.word),
        })
        setMessage('')
        resetGameState()
      } else {
        ReactGA.event({
          category: 'guess_category',
          action: 'guess_action',
          label: 'guess_label'
        })
        setMessage(data?.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form id="pokusaj" className="w-full" onSubmit={handleSubmit(onSubmit)}>
      {gameState.guesses > 3 && <p className="text-xs mb-2 text-gray-400">Pokušaj {gameState.guesses}</p>}
      <input
        placeholder="Upišite reč"
        {...register('query')}
        className="w-full border-2 border-gray-300 bg-gray-800 rounded-md text-xl py-2 px-4"
      />
    </form>
  )
}
