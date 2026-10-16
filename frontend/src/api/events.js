import { sortEvents } from '../utils/events.js'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

async function readError(response, fallback) {
  const result = await response.json()
  const detail = result.detail
  const message = Array.isArray(detail)
    ? detail.map((issue) => issue.msg).join(' ')
    : detail
  return new Error(message || fallback)
}

export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/api/events`)
  if (!response.ok) throw new Error('Could not load events. Please try again.')
  return sortEvents(await response.json())
}

export async function createEvent(event) {
  const response = await fetch(`${API_BASE_URL}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  })

  if (!response.ok) {
    throw await readError(response, 'Could not publish your event.')
  }

  return response.json()
}
