import { useForm } from 'react-hook-form'
import {FC, useState} from 'react'
import {deactivateGame, toplohladnoInstance, useGetGameGuesses} from "../api/toplohladno.ts";
import {IGameInstance} from "../types.ts";
import TextWithNewLine from "./TextWithNewLine.tsx";
import {IGuessResponse} from "./static.ts";
import Modal from "./Modal.tsx";
import {TH_GAME_STATUS} from "@prisma/client";
import {cyrilicToLatin} from "serbian-script-converter";

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

  async function onSubmit(props: InputProps) {
    const { data } : { data: IGuessResponse } = await toplohladnoInstance.post('/guess', { query: props.query.toLowerCase(), game_id: gameInstance.game_instance.id })
    mutate()
    reset()

    if(data.score !== 0) {
      setMessage(data.message)
    }

    resetInstance()
  }
  async function handleNewGame() {
    await deactivateGame(gameInstance.game_instance.id)
    resetInstance()
  }

  return (
    <div className="w-full">
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

      <Modal isOpen={gameInstance.game_instance.status === TH_GAME_STATUS.SOLVED} onClose={handleNewGame}>
        <h1 className="mb-4">Čestitamo!</h1>
        <h1>
          <span className="font-bold uppercase">{cyrilicToLatin(gameInstance.game_instance.final_word.word)}</span> je tražena reč!
        </h1>
        <p className="font-md text-gray-400 mt-4">
              Broj pokušaja: {gameInstance.guesses_count + 1}
        </p>


        {/*{stats && stats.total_plays > 1 && (*/}
        {/*  <div className="bg-gray-700 mt-8 p-4 rounded-xl flex flex-col gap-2">*/}
        {/*    <p>*/}
        {/*      - ova reč je pronađena {stats.total_plays} put{stats.total_plays === 1 ? '' : 'a'}*/}
        {/*    </p>*/}
        {/*    <p>- prosečno pokušaja {stats.avg_steps + 1}</p>*/}
        {/*    <p>*/}
        {/*      - rekord: {stats.min_steps + 1} pokušaj{stats.min_steps === 0 ? '' : 'a'}*/}
        {/*    </p>*/}
        {/*  </div>*/}
        {/*)}*/}

        <button
          type="button"
          className="bg-gray-600 px-3 py-2 hover:bg-gray-700 hover:border-gray-400 rounded-md mt-8"
          onClick={handleNewGame}
        >
              nova igra
        </button>
      </Modal>
    </div>
  )
}
