import {toplohladnoInstance} from "../api/toplohladno.ts";
import {deleteToken, setToken} from "./local.ts";

export const MAX_GUESSES_TO_SHOW = 10

export const GUESSES_REQUIRED_FOR_GIVEUP = 15
export interface IGuessResponse {
  word: string
  valid: boolean
  message: string
  score?: number
}

export enum IGameScreen {
  GAME,
  WIN,
}

export function setTokenInAxios(token: string | null) {
  if (token) {
    // Apply the token to every request
    toplohladnoInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setToken(token)
  } else {
    // Remove the token from header if it doesn't exist
    delete toplohladnoInstance.defaults.headers.common['Authorization'];
    deleteToken()
  }
}


export const green = '#00ba7c'
export const red = '#f91880'
export const orange = '#ef7d31'
