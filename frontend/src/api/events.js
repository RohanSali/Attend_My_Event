import { sortEvents } from '../utils/events.js'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

async function readError(response, fallback) {
  if (!response.headers.get('content-type')?.includes('application/json')) {
    return new Error(`${fallback} (HTTP ${response.status})`)
  }

  const result = await response.json()
  const detail = result.detail
  const message = Array.isArray(detail)
    ? detail.map((issue) => issue.msg).join(' ')
    : detail
  return new Error(message || fallback)
}

export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/events`)
  if (!response.ok) throw new Error('Could not load events. Please try again.')
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The API returned a non-JSON response. Check the frontend API proxy.')
  }
  return sortEvents(await response.json())
}

export async function createEvent(event) {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  })

  if (!response.ok) {
    throw await readError(response, 'Could not publish your event.')
  }

  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The API returned a non-JSON response. Check the frontend API proxy.')
  }

  return response.json()
}
