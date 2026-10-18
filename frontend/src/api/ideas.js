const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export async function getRandomIdea() {
  const response = await fetch(`${API_BASE_URL}/ideas/random`)
  if (!response.ok) {
    throw new Error('Could not find an event idea. Please try again.')
  }
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The API returned a non-JSON response. Check the frontend API proxy.')
  }
  return response.json()
}
