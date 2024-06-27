import {FC, useEffect, useRef, useState} from 'react'
import {toplohladnoInstance, useGetClue, useGetGameGuesses } from "../api/toplohladno.ts";
import {IGameInstance} from "../types.ts";
import {IGuessResponse} from "./static.ts";
import Keyboard, {KeyboardReactInterface} from "react-simple-keyboard";
import clsx from "clsx";
import TextWithNewLine from "./TextWithNewLine.tsx";
import {cyrilicToLatin} from "serbian-script-converter";
import {ColoredTouchInput} from "./modals/ColoredTouchInput.tsx";

interface IWordInputProps {
  gameInstance: IGameInstance
    resetInstance: () => void
}

export const TouchInput: FC<IWordInputProps> = ({ gameInstance, resetInstance }) => {
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')
  const { mutate } = useGetGameGuesses(gameInstance.game_instance.id)
  const { mutate: mutateClue, clueInfo } = useGetClue(gameInstance.game_instance.id)
  const inputRef = useRef<HTMLDivElement>(null)
  const keyboardRef = useRef<KeyboardReactInterface | null>(null)

  async function onSubmit() {
    if(!input) return
    resetKeyboard()
    const { data } : { data: IGuessResponse } = await toplohladnoInstance.post('/guess', { query: input.toLowerCase(), game_id: gameInstance.game_instance.id })
    await mutate()

    if(data.score !== 0) {
      setMessage(data.message)
    }

    if(data.score && data.score <= clueInfo.nextHelpAt) {
      mutateClue()
    }
    resetInstance()
  }

  function handleOnChange(keyboardInput: string) {
    setInput(keyboardInput)
  }

  function resetKeyboard() {
    keyboardRef.current?.clearInput()
    setInput('')
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && inputRef.current.contains(event.target as Node)) {
        resetKeyboard()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inputRef])

  useEffect(() => {
    clueInfo.keyboardClue.forEach(kc => {
      const button = cyrilicToLatin(kc).toUpperCase()
      const buttonElement = document.querySelector(`.hg-button[data-skbtn="${button}"]`) as HTMLDivElement | null;
      if (buttonElement) {
        const randomDelay = Math.random() * 1000;

        buttonElement.setAttribute('data-after', button); // neda mi promenljivu da stavim u content pa moram ovako
        buttonElement.style.setProperty('--animation-delay', `${randomDelay}ms`);
        buttonElement.classList.add("modify-after");
        buttonElement.classList.add("stamp-button");
      }
    })
  }, [clueInfo.keyboardClue]);

  function handleOnPress(keyboardInput: string, e?: MouseEvent | undefined) {
    if(!e) return
    e.preventDefault()
    e.stopPropagation()
    if(keyboardInput === '{enter}') {
      onSubmit()
    }
  }

  return <div className={clsx("fixed bottom-0 flex flex-col text-black w-full justify-end md:hidden", input && 'h-full')}>
    {input && <div className="flex justify-center items-center bg-gray-800 flex-1 opacity-90 relative" ref={inputRef}>
      <div className="px-4 py-2 text-white text-3xl bg-gray-900 rounded-md absolute">
        <ColoredTouchInput input={input} keyboardClues={clueInfo.keyboardClue} />
      </div>
    </div>}
    {message && <div className="text-gray-400 text-sm py-2 bg-gray-800 opacity-90">
      <TextWithNewLine text={message} />
    </div>}
    <Keyboard
      keyboardRef={(r) => (keyboardRef.current = r)}
      layout={{
        default: [
          "Đ E R T Z U I O P Š",
          "A S D F G H J K L Č",
          "Ć Ž C V B N M {backspace}",
          "{enter}"
        ]}}
      display={{
        "{backspace}": "⌫",
        "{enter}": "⏎",
      }}
      buttonTheme={[
        {
          class: "hg-backspace",
          buttons: "{backspace}"
        },
        {
          class: "hg-enter",
          buttons: "{enter}"
        }
      ]}
      onChange={handleOnChange}
      onKeyPress={handleOnPress}
    />
  </div>
}
