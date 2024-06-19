import { FC, useEffect, useRef, useState } from 'react'
import DiscordIcon from '../assets/discord-icon.png'
import {giveUpGame, toplohladnoInstance, useGetClue} from "../api/toplohladno.ts";
import {IGameInstance} from "../types.ts";
import {TH_GAME_STATUS} from "@prisma/client";
import {GUESSES_REQUIRED_FOR_GIVEUP } from "./static.ts";
import clsx from "clsx";
import {useGoogleLogin} from "@react-oauth/google";
import {GiveUpModal} from "./modals/GiveUpModal.tsx";
import {HowToPlayModal} from "./modals/HowToPlay.tsx";
import {useAuth} from "../hooks/AuthContext.tsx";

interface IMenu {
  gameInstance: IGameInstance,
  resetInstance: () => void
}

export const Menu: FC<IMenu> = ({ gameInstance, resetInstance }) => {
  const { token, setToken } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenHowToPlayModal, setIsOpenHowToPlayModal] = useState(false)
  const { mutate: mutateClue } = useGetClue(gameInstance.game_instance.id)
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
      await resetInstance()
      await mutateClue()
      setIsOpen(false)
    } catch (err) {
      console.log('error', err)
    }
  }

  function handleHowToPlay() {
    setIsOpenHowToPlayModal(true)
    setIsOpen(false)
  }

  const isActiveGame = gameInstance.game_instance.status === TH_GAME_STATUS.ONGOING
  const hasEnoughtGuessesForGiveup = gameInstance.guesses_count >= GUESSES_REQUIRED_FOR_GIVEUP

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const { data } = await toplohladnoInstance.post('/auth/google-login', { token: tokenResponse.access_token }) as { data : { token: string }}
      if(data.token) {
        setToken(data.token)
        setIsOpen(false)
      }
    }
  });

  function logout() {
    setToken(null)
    setIsOpen(false)
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
          {!token && <button onClick={() => handleGoogleLogin()} className="hover:bg-gray-700 px-2 py-2 rounded-md w-full flex justify-start items-center">
            <svg className="mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 50 50">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Prijava
          </button>}
          {isActiveGame && (
            <button disabled={!hasEnoughtGuessesForGiveup} onClick={handleGiveUp} className={clsx(`px-2 py-2 rounded-md w-full flex justify-start items-center`, !hasEnoughtGuessesForGiveup ? 'text-gray-400' : 'hover:bg-gray-700 ')}>
              <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21.294 21.294 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21.317 21.317 0 0 0 14 7.655V1.222z"></path>
              </svg>
              {hasEnoughtGuessesForGiveup ? 'Predajem se' : `još ${GUESSES_REQUIRED_FOR_GIVEUP - gameInstance.guesses_count} pokušaja`}
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
            <img src={DiscordIcon} style={{ width: '18px'}} className="mr-2" alt="discord logo" />
            Discord
          </a>
          {token && <button onClick={logout} className="hover:bg-gray-700 px-2 py-2 rounded-md w-full flex justify-start items-center">
            <svg className="mr-2 ml-0.5" fill="currentColor" height="16" width="16" viewBox="0 0 384.971 384.971">
              <g>
                <g id="Sign_Out">
                  <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03
			C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03
			C192.485,366.299,187.095,360.91,180.455,360.91z"/>
                  <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279
			c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179
			c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"/>
                </g>
              </g>
            </svg>
            Odjava
          </button>}
        </div>
      )}
      <GiveUpModal gameInstance={gameInstance} resetInstance={resetInstance} />
      <HowToPlayModal isOpenHowToPlayModal={isOpenHowToPlayModal} setIsOpenHowToPlayModal={setIsOpenHowToPlayModal} />
    </div>
  )
}
