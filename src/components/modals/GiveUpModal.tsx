import Modal from "../Modal.tsx";
import {TH_GAME_STATUS} from "@prisma/client";
import {cyrilicToLatin} from "serbian-script-converter";
import {WordStats} from "../WordStats.tsx";
import {IGameInstance} from "../../types.ts";
import {FC} from "react";
import {deactivateGame} from "../../api/toplohladno.ts";

interface IGiveUpModal {
    gameInstance: IGameInstance,
    resetInstance: () => void
}
export const GiveUpModal: FC<IGiveUpModal> = ({ gameInstance, resetInstance }) => {
  async function handleNewGame() {
    await deactivateGame(gameInstance.game_instance.id)
    resetInstance()
  }

  return <Modal isOpen={gameInstance.game_instance.status === TH_GAME_STATUS.GIVEUP} onClose={handleNewGame}>
        Zadata rec je bila
    <h1 className="text-2xl uppercase font-bold my-4 text-white">{cyrilicToLatin(gameInstance.game_instance.final_word.word)}</h1>
    <WordStats word_id={gameInstance.game_instance.final_word_id} />
    <button
      type="button"
      className="bg-gray-600 px-3 py-2 hover:bg-gray-800 hover:border-gray-400 rounded-md mt-2"
      onClick={handleNewGame}
    >
            nova igra
    </button>
  </Modal>
}
