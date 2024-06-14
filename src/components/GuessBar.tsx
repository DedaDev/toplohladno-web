import clsx from 'clsx'
import { FC } from 'react'
import {green, orange, red} from "./static.ts";
import {Prisma} from "@prisma/client";
import {cyrilicToLatin} from "serbian-script-converter";

const MAX_WORDS = 23867

interface IGuessBarProps {
  guess: Prisma.th_web_game_guessesGetPayload<{ include: { word: { select: { word: true }} }}>
  highlighted: boolean
  nextReward?: boolean
}

function getReward(similarity_rank: number) {
  if(similarity_rank > 3800) {
    return 3800
  } else if ( similarity_rank > 500) {
    return 500
  }

  return null
}

function getWidthForSimilarity(similarity_rank = 0) {
  const scalingFactor = 0.01
  const width = (Math.log(similarity_rank * scalingFactor + 1) / Math.log(MAX_WORDS * scalingFactor + 1)) * 100
  return 100 - width
}

function getColor(width: number) {
  if (width > 80) return green
  if (width > 30) return orange
  if (width > 0) return red
}

export const GuessBar: FC<IGuessBarProps> = ({ guess, highlighted = false, nextReward = false}) => {
  // skejluj max words na 100
  const { similarity_rank, word } = guess
  const barWidth = getWidthForSimilarity(similarity_rank)
  const barColor = getColor(barWidth)

  const getRewardPoint = getReward(similarity_rank)
  const rewardOffset = getWidthForSimilarity(getRewardPoint || 0)

  return (
    <div className={clsx('bg-gray-700 rounded-md w-full h-10 relative', highlighted && 'border-2 border-gray-300')}>
      <div className="h-full rounded p-2" style={{ width: `${barWidth}%`, backgroundColor: barColor }}></div>
      <div className="absolute font-semibold text inset-0 flex justify-between items-center px-2">
        <div className="text-xl">{cyrilicToLatin(word.word)}</div>
        <div className="text-md font-normal">{similarity_rank}</div>
      </div>
      {getRewardPoint && nextReward && <div className="h-full w-1 border-dashed absolute inset-0"
        style={{
          borderRightWidth: '2px',
          marginLeft: `${rewardOffset}%`,
          // borderColor: rewardColor,
          // animation: 'colorCycle 2s infinite'
        }}></div>}
    </div>
  )
}
