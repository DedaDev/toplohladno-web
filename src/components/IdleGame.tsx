import { cyrilicToLatin } from 'serbian-script-converter'
import {FC} from "react";

interface IdleGameProps {
    username: string,
    final_word: string
}

export const IdleGame: FC<IdleGameProps> = ({ username, final_word }) => {
  return (
    <div className="flex flex-col items-center h-screen text-white pt-12 mt-20">
      <p>
        Čestitke <span className="font-bold">{username}</span>
      </p>
      <p className="text-3xl font-bold my-2" style={{ letterSpacing: 10 }}>
        {cyrilicToLatin(final_word).toUpperCase()}
      </p>
      <p>je tražena reč!</p>
      <p className="mt-8">Sledeća igra uskoro počinje!</p>
    </div>
  )
}
