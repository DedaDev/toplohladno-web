import Modal from "../Modal.tsx";
import {TH_GAME_STATUS} from "@prisma/client";
import {cyrilicToLatin} from "serbian-script-converter";
import {WordStats} from "../WordStats.tsx";
import {deactivateGame, useGetStats} from "../../api/toplohladno.ts";
import {IGameInstance} from "../../types.ts";
import {FC} from "react";


interface IGiveUpModal {
    gameInstance: IGameInstance,
    resetInstance: () => void
}

export const SolvedModal: FC<IGiveUpModal> = ({ gameInstance, resetInstance }) => {
  const { stats } = useGetStats(gameInstance.game_instance.final_word_id)
  async function handleNewGame() {
    await deactivateGame(gameInstance.game_instance.id)
    resetInstance()
  }

  const solvedStats = stats.find(s => s.status === TH_GAME_STATUS.SOLVED)

  return <Modal isOpen={gameInstance.game_instance.status === TH_GAME_STATUS.SOLVED} onClose={handleNewGame}>
    <h1 className="mb-4">Čestitamo!</h1>
    <h1>
      <span className="font-bold uppercase">{cyrilicToLatin(gameInstance.game_instance.final_word.word)}</span> je tražena reč!
    </h1>
    <p className="font-md text-gray-400 text-sm mt-4 mb-4">
            Broj pokušaja: {gameInstance.guesses_count + 1}
    </p>

    {solvedStats && solvedStats.total_plays > 1 && <WordStats word_id={gameInstance.game_instance.final_word_id} />}

    <button
      type="button"
      className="bg-gray-600 px-3 py-2 hover:bg-gray-700 hover:border-gray-400 rounded-md mt-2"
      onClick={handleNewGame}
    >
            nova igra
    </button>
  </Modal>
}