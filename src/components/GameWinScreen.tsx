import { FC, useEffect, useState } from 'react'
import { clearLocalState, ILocalState } from './local'
import {toplohladnoInstance} from "../api/toplohladno.ts";

interface IGameWinScreenProps {
  resetGameState: () => void
  gameState: ILocalState
}

interface IWordStats {
  avg_steps: number
  min_steps: number
  total_plays: number
}

export const GameWinScreen: FC<IGameWinScreenProps> = ({ resetGameState, gameState }) => {
  const [stats, setStats] = useState<IWordStats | null>(null)
  function handleNewGame() {
    clearLocalState()
    resetGameState()
  }

  async function getWordStats() {
    const wordStats = await toplohladnoInstance.post('/get_word_stats', { word_id: gameState.word_id }).then((res) => res.data)
    setStats(wordStats)
  }

  useEffect(() => {
    getWordStats()
  }, [])

  return (
    <div className="flex flex-col justify-center items-center mt-8 p-4">
      <h1 className="mb-4">Čestitamo!</h1>
      <h1>
        <span className="font-bold uppercase">{gameState.best_guesses[0].word}</span> je tražena reč!
      </h1>

        <p className="font-md text-gray-400 mt-4">
            Broj pokušaja: {gameState.guesses}
        </p>

      {stats && stats.total_plays > 1 && (
        <div className="bg-gray-700 mt-8 p-4 rounded-xl flex flex-col gap-2">
          <p>
            - ova reč je pronađena {stats.total_plays} put{stats.total_plays === 1 ? '' : 'a'}
          </p>
          <p>- prosečno pokušaja {stats.avg_steps + 1}</p>
          <p>
            - rekord: {stats.min_steps + 1} pokušaj{stats.min_steps === 0 ? '' : 'a'}
          </p>
        </div>
      )}
      <button
        type="button"
        className="bg-gray-600 px-3 py-2 hover:bg-gray-700 hover:border-gray-400 rounded-md mt-8"
        onClick={handleNewGame}
      >
        nova igra
      </button>
    </div>
  )
}
