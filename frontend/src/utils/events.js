export function sortEvents(events) {
  const now = Date.now()
  return [...events].sort((first, second) => {
    const firstStart = new Date(first.starts_at).getTime()
    const secondStart = new Date(second.starts_at).getTime()
    const firstIsUpcoming = firstStart >= now
    const secondIsUpcoming = secondStart >= now

    if (firstIsUpcoming !== secondIsUpcoming) return firstIsUpcoming ? -1 : 1
    return firstIsUpcoming ? firstStart - secondStart : secondStart - firstStart
  })
}

export function formatEventDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}
