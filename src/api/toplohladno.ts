import axios from 'axios'

export const toplohladnoInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL
})

export function getWordById(word_id: number) {
  return toplohladnoInstance.post('/get_word_by_id', { word_id }).then((res) => res.data as string)
}
