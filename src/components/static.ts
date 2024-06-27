export const MAX_GUESSES_TO_SHOW = 8

export const GUESSES_REQUIRED_FOR_GIVEUP = 15
export interface IGuessResponse {
  word: string
  valid: boolean
  message: string
  score?: number
}

export const green = '#00ba7c'
export const red = '#f91880'
export const orange = '#ef7d31'
