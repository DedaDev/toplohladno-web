import {FC} from "react";

export const Clue: FC<{ clue: string }> = ({ clue }) => {
    return <p className="italic text-gray-400 text-sm flex justify-center text-center">„{clue}”</p>
}