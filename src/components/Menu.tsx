import { FC, useEffect, useRef, useState } from 'react'
import Modal from './Modal.tsx'
import { cyrilicToLatin } from 'serbian-script-converter'
import DiscordIcon from './discord-icon.png'
import {deactivateGame, giveUpGame} from "../api/toplohladno.ts";
import {Clue} from "./Clue.tsx";
import {IGameInstance} from "../types.ts";
import {TH_GAME_STATUS} from "@prisma/client";

export const Menu: FC<{ gameInstance: IGameInstance, resetInstance: () => void }> = ({ gameInstance, resetInstance }) => {
  const [clueModal, setClueModal] = useState(false)
  const [howToPlayModal, setHowToPlayModal] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function handleGiveUp() {
    try {
      await giveUpGame(gameInstance.game_instance.id)
      resetInstance()
      setIsOpen(false)
    } catch (err) {
      console.log('doslo je do greske', err)
    }
  }

  function handleHowToPlay() {
    setHowToPlayModal(true)
    setIsOpen(false)
  }

  const isActiveGame = gameInstance.game_instance.status === TH_GAME_STATUS.ONGOING

  function handleClue() {
    setClueModal(true)
    setIsOpen(false)
  }

  async function handleNewGame() {
    await deactivateGame(gameInstance.game_instance.id)
    resetInstance()
  }

  return (
    <div className="absolute right-0 top-0 flex flex-col items-end" ref={menuRef}>
      <button onClick={() => setIsOpen((o) => !o)} className="hover:bg-gray-700 p-1 rounded-full">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M12 6v.01M12 12v.01M12 18v.01" />
        </svg>
      </button>
      {isOpen && (
        <div className="bg-gray-600 p-2 rounded-xl mt-4 flex flex-col items-start z-10">
          {isActiveGame && (
            <button onClick={handleClue} className="hover:bg-gray-700 px-2 py-2 rounded-md w-full flex justify-start items-center">
              <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z"></path></svg>
                Pomoć
            </button>
          )}
          {isActiveGame && (
            <button onClick={handleGiveUp} className="hover:bg-gray-700 px-2 py-2 rounded-md w-full flex justify-start items-center">
              <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21.294 21.294 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21.317 21.317 0 0 0 14 7.655V1.222z"></path>
              </svg>
              Predajem se
            </button>
          )}
          <button onClick={handleHowToPlay} className="hover:bg-gray-700 px-2 py-2 rounded-md w-full flex justify-start items-center">
            <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
              <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"></path>
            </svg>
            Kako se igra
          </button>
          <a
            href="https://discord.gg/KqCgg8Q"
            target="_blank"
            className="hover:bg-gray-700 px-2 py-2 rounded-md w-full flex justify-start items-center"
          >
            <img src={DiscordIcon} className="w-5 mr-2" alt="discord logo" />
            Discord
          </a>
        </div>
      )}
      <Modal isOpen={gameInstance.game_instance.status === TH_GAME_STATUS.GIVEUP} onClose={handleNewGame}>
        Zadata rec je bila
        <h1 className="text-2xl uppercase font-bold my-4 text-white">{cyrilicToLatin(gameInstance.game_instance.final_word.word)}</h1>
        <button
          type="button"
          className="bg-gray-600 px-3 py-2 hover:bg-gray-800 hover:border-gray-400 rounded-md mt-2"
          onClick={handleNewGame}
        >
          nova igra
        </button>
      </Modal>
      <Modal isOpen={howToPlayModal} onClose={() => setHowToPlayModal(false)}>
        <h1 className="text-xl mb-4">Kako se igra?</h1>
        <p className="text-sm">
          Vaš zadatak je da pronađete skrivenu reč, imate neograničen broj pokušaja!
          <br />
          <br />
          Uz svaki pokušaj dobićete povratnu informaciju koliko je vaša reč &quot;blizu&quot; zadate reči.
          Broj pored reči označava koliko ima bližih reči od te reči.
          <br />
          <br />
          Blizinu određuje kompleksan AI algoritam.
          <br />
          <br />
          Srećno!
        </p>
      </Modal>
      <Modal isOpen={clueModal} onClose={() => setClueModal(false)}>
        <Clue clue={gameInstance.game_instance.final_word.human_clue} />
      </Modal>
    </div>
  )
}
