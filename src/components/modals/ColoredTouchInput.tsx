import {FC} from "react";
import {latinToCyrilic} from "serbian-script-converter";
import clsx from "clsx";

interface IColoredTouchInput {
    input: string,
    keyboardClues: string[]
}

export const ColoredTouchInput: FC<IColoredTouchInput> = ({ input, keyboardClues }) => {
  const lettersList = input.split('').map(letter => {
    return {
      letter,
      grayed: keyboardClues.some(kc => latinToCyrilic(letter).toLowerCase() === kc)
    }
  })

  return <div className="font-bold tracking-wider">
    {lettersList.map((l, i) => <span key={l.letter + i} className={clsx( l.grayed && 'opacity-60')}>{l.letter}</span>)}
  </div>
}