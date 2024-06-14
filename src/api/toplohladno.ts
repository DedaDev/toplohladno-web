import axios from 'axios'
import useSWR from 'swr'
import {Prisma} from "@prisma/client";
import {IGameInstance} from "../types.ts";

export const toplohladnoInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL
})

export function giveUpGame(game_id: number) {
  return toplohladnoInstance.post('/giveup', { game_id }).then((res) => res.data as { word: string })
}


export function deactivateGame(game_id: number) {
  return toplohladnoInstance.post('/deactivate_game', { game_id }).then((res) => res.data as { word: string })
}


export function useGetGameGuesses(game_id: number | null) {
  const { data, error, isLoading, mutate } = useSWR(game_id ? [`/get_guesses`, game_id]: null, ([path, game_id]) => {
    return toplohladnoInstance.post(path, { game_id }).then((res) => res.data as Prisma.th_web_game_guessesGetPayload<{ include: { word: { select: { word: true }} }}>[])
  })

  return {
    guesses: data,
    isLoading,
    isError: error,
    mutate,
  }
}


export function useGetClue(game_id: number | null) {
  const { data = [], error, isLoading, mutate } = useSWR(game_id ? [`/get_clue`, game_id]: null, ([path, game_id]) => {
    return toplohladnoInstance.post(path, { game_id }).then((res) => res.data as string[])
  })

  return {
    clueArray: data,
    isLoading,
    isError: error,
    mutate,
  }
}


export function useGetGameInstance(game_id: number | null) {
  const { data, error, isLoading, mutate } = useSWR([`/get_game`, game_id], ([path, game_id]) => {
    return toplohladnoInstance.post(path, { game_id }).then((res) => res.data as IGameInstance)
  })

  return {
    gameInstance: data,
    isLoading,
    isError: error,
    mutate,
  }
}
