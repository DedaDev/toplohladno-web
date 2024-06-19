import {FC, Fragment, useState} from "react";
import {toplohladnoInstance, useGetStats} from "../api/toplohladno.ts";
import {TH_GAME_STATUS} from "@prisma/client";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/solid";
import {useGoogleLogin} from "@react-oauth/google";
import {green} from "./static.ts";
import {useAuth} from "../hooks/AuthContext.tsx";

export const WordStats: FC<{ word_id: number | null }> = ({ word_id }) => {
  const { token, setToken } = useAuth()
  const { stats } = useGetStats(word_id)
  const [isExpanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(0)

  const solvedStats = stats.find(s => s.status === TH_GAME_STATUS.SOLVED)
  const giveup = stats.find(s => s.status === TH_GAME_STATUS.GIVEUP)

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const { data } = await toplohladnoInstance.post('/auth/google-login', { token: tokenResponse.access_token }) as { data : { token: string }}
      if(data.token) {
        setToken(data.token)
      }
    }
  });

  function toggleExpand() {
    setExpanded(e => !e)
    setHeight(isExpanded ? 0 : 155)
  }

  if(!solvedStats) return

  return <div className="flex flex-col justify-center items-center mt-4">
    <button onClick={toggleExpand} className="flex items-center justify-between p-2 rounded-md">
      <span className="mr-4">statistika</span>
      {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
    </button>

    <div style={{ overflow: "hidden", height, transition: 'height 0.5s ease' }}>
      {isExpanded && <div className="bg-gray-700 p-4 pt-0 rounded-xl flex flex-col gap-2">
        {solvedStats && <Fragment>

          {!token && <p className="text-center mb-2 text-gray-400 text-sm">
            <span onClick={() => handleGoogleLogin()} className="hover:bg-gray-700 rounded-md underline cursor-pointer" style={{ color: green}}>
            Prijavite
            </span> se
            kako bismo sačuvali vašu statistiku
          </p>}

          <p>
        - ova reč je pronađena {solvedStats.total_plays} put{solvedStats.total_plays === 1 ? '' : 'a'}
          </p>
          <p>- prosečno pokušaja {Math.round(solvedStats.avg_steps)}</p>
          <p>
        - rekord: {solvedStats.min_steps} pokušaj{solvedStats.min_steps === 1 ? '' : 'a'}
          </p>
          {giveup && <p>
        - odustajanja: {giveup.total_plays}
          </p>}
        </Fragment>}
      </div>}
    </div>
  </div>
}