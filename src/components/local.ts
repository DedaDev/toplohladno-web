const GAME_ID_KEY = 'game-state'
const TOKEN_KEY = 'token'

export function setToken(token: string) {
  return localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function deleteToken() {
  return localStorage.removeItem(TOKEN_KEY)
}

export function setLocalGameId(game_id: number) {
  return localStorage.setItem(GAME_ID_KEY, game_id.toString())
}

export function getLocalGameId() {
  const local_state = localStorage.getItem(GAME_ID_KEY)
  if (local_state) return parseInt(local_state)
  return null
}