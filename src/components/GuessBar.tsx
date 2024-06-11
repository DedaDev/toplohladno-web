import clsx from 'clsx'
import { FC } from 'react'
import {green, orange, red} from "./static.ts";
import {Prisma} from "@prisma/client";
import {cyrilicToLatin} from "serbian-script-converter";

const MAX_WORDS = 23867

interface IGuessBarProps {
  guess: Prisma.th_web_game_guessesGetPayload<{ include: { word: { select: { word: true }} }}>
  highlighted: boolean
}

export const GuessBar: FC<IGuessBarProps> = ({ guess, highlighted = false }) => {
  // skejluj max words na 100
  const { similarity_rank, word } = guess
  const scalingFactor = 0.01
  const width = (Math.log(similarity_rank * scalingFactor + 1) / Math.log(MAX_WORDS * scalingFactor + 1)) * 100
  const adjustedWidth = 100 - width

  function getColor() {
    if (adjustedWidth > 80) return green
    if (adjustedWidth > 30) return orange
    if (adjustedWidth > 0) return red
  }

  const backgroundColor = getColor()

  return (
    <div className={clsx('bg-gray-700 rounded-md w-full h-10 relative', highlighted && 'border-2 border-gray-300')}>
      <div className="h-full rounded p-2" style={{ width: `${adjustedWidth}%`, backgroundColor }}></div>
      <div className="absolute font-semibold text inset-0 flex justify-between items-center px-2">
        <div className="text-xl">{cyrilicToLatin(word.word)}</div>
        <div className="text-md font-normal">{similarity_rank}</div>
      </div>
    </div>
  )
}
