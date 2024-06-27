import { useForm } from 'react-hook-form'
import {FC, useState} from 'react'
import {toplohladnoInstance, useGetClue, useGetGameGuesses } from "../api/toplohladno.ts";
import {IGameInstance} from "../types.ts";
import TextWithNewLine from "./TextWithNewLine.tsx";
import {IGuessResponse} from "./static.ts";

interface InputProps {
  query: string
}

interface IWordInputProps {
  gameInstance: IGameInstance
    resetInstance: () => void
}

export const WordInput: FC<IWordInputProps> = ({ gameInstance, resetInstance }) => {
  const [message, setMessage] = useState('')
  const { mutate } = useGetGameGuesses(gameInstance.game_instance.id)
  const { register, handleSubmit, reset } = useForm<InputProps>()
  const { mutate: mutateClue, clueInfo } = useGetClue(gameInstance.game_instance.id)

  async function onSubmit(props: InputProps) {
    const { data } : { data: IGuessResponse } = await toplohladnoInstance.post('/guess', { query: props.query.toLowerCase(), game_id: gameInstance.game_instance.id })
    mutate()
    reset()

    if(data.score !== 0) {
      setMessage(data.message)
    }

    if(data.score && data.score <= clueInfo.nextHelpAt) {
      mutateClue()
    }
    resetInstance()
  }

  return (
    <div className="w-full hidden md:block">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        {gameInstance.guesses_count > 3 && <p className="text-xs mb-2 text-gray-400">Pokušaj {gameInstance.guesses_count}</p>}
        <input
          placeholder="Upišite reč"
          {...register('query')}
          className="w-full border-2 border-gray-300 bg-gray-800 rounded-md text-xl py-2 px-4"
        />
      </form>
      <div className="text-gray-400 text-sm mt-2">
        <TextWithNewLine text={message} />
      </div>
    </div>
  )
}
