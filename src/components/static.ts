export const MAX_GUESSES_TO_SHOW = 10
export interface IGuessResponse {
  word: string
  valid: boolean
  message: string
  score?: number
  similarity?: number
  lowest_similarity?: number
}

export enum IGameScreen {
  GAME,
  WIN,
}

export const green = '#00ba7c'
export const red = '#f91880'
export const orange = '#ef7d31'
