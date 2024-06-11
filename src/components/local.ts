export interface IGoodGuess {
  score: number
  word: string
}
export interface ILocalState {
  human_clue: string
  word_id: number
  guesses: number
  best_guesses: IGoodGuess[]
  last_guess: IGoodGuess | null
}

const GAME_ID_KEY = 'game-state'

// export async function getGameState(): Promise<ILocalState> {
//   const local_state = getLocalState()
//   if (local_state) return local_state
//   try {
//     const { word_id, human_clue } = await toplohladnoInstance.get('/get_random_word').then((res) => res.data)
//     const newState: ILocalState = {
//       word_id,
//       guesses: 0,
//       best_guesses: [],
//       last_guess: null,
//       human_clue
//     }
//     setLocalState(newState)
//     return newState
//   } catch (err) {
//     console.log(err)
//     throw new Error('Doslo je do greske')
//   }
// }

// export async function pushGuessToState(goodGuess: IGoodGuess) {
//   const local_state = await getGameState()
//   const { best_guesses } = local_state
//   local_state.last_guess = goodGuess
//   if (best_guesses.length > 0) {
//     const hasWord = best_guesses.find((bg) => bg.word === cyrilicToLatin(goodGuess.word))
//     if (hasWord) {
//       setLocalState(local_state)
//       return
//     }
//     best_guesses.push(goodGuess)
//     best_guesses.sort((a, b) => a.score - b.score)
//     local_state.best_guesses = best_guesses.slice(0, 10)
//   } else {
//     best_guesses.push(goodGuess)
//   }
//   local_state.guesses++
//   setLocalState(local_state)
//   return local_state
// }

export function setLocalGameId(game_id: number) {
  return localStorage.setItem(GAME_ID_KEY, game_id.toString())
}

export function getLocalGameId() {
  const local_state = localStorage.getItem(GAME_ID_KEY)
  if (local_state) return parseInt(local_state)
  return null
}

// export function clearLocalState() {
//   localStorage.removeItem(STATE_KEY)
// }
