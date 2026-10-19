import { useEffect, useMemo, useState } from 'react'
import { createEvent, getEvents } from './api/events.js'
import CreateEventForm from './components/CreateEventForm.jsx'
import EventsSection from './components/EventsSection.jsx'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import WelcomeBanner from './components/WelcomeBanner.jsx'
import { CATEGORIES, EMPTY_EVENT_FORM } from './constants/events.js'
import { sortEvents } from './utils/events.js'

function App() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(EMPTY_EVENT_FORM)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let isMounted = true

    getEvents()
      .then((loadedEvents) => {
        if (isMounted) setEvents(loadedEvents)
      })
      .catch((requestError) => {
        if (isMounted) {
          setLoadError(requestError instanceof Error ? requestError.message : 'Could not load events.')
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const visibleEvents = useMemo(() => {
    const query = search.trim().toLowerCase()
    return events.filter((event) => {
      const matchesCategory = category === 'All categories' || event.category === category
      const matchesSearch =
        !query ||
        `${event.title} ${event.category} ${event.venue} ${event.description}`
          .toLowerCase()
          .includes(query)
      return matchesCategory && matchesSearch
    })
  }, [category, events, search])

  async function refreshEvents() {
    setIsLoading(true)
    setLoadError('')
    try {
      setEvents(await getEvents())
    } catch (requestError) {
      setLoadError(requestError instanceof Error ? requestError.message : 'Could not load events.')
    } finally {
      setIsLoading(false)
    }
  }

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submitEvent(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    setIsSubmitting(true)

    try {
      const newEvent = await createEvent({
        ...form,
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: new Date(form.ends_at).toISOString(),
      })
      setEvents((current) => sortEvents([...current, newEvent]))
      setLoadError('')
      setForm(EMPTY_EVENT_FORM)
      setNotice('Your event is on the list. See you there!')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not publish your event.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen min-w-[320px] bg-[#f6f8fb] font-sans antialiased">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[1180px] text-[#17212b] sm:w-[calc(100%-2.5rem)]">
        <Navbar />
        <main>
          <WelcomeBanner />
          <section
            className="my-9 grid items-start gap-7 max-[850px]:grid-cols-[minmax(0,1fr)_310px] max-[850px]:gap-[18px] max-[680px]:grid-cols-1 max-[680px]:gap-3 max-[680px]:my-7"
            id="explore"
            aria-label="Explore and create events"
          >
            <EventsSection
              events={events}
              visibleEvents={visibleEvents}
              search={search}
              category={category}
              isLoading={isLoading}
              loadError={loadError}
              onSearchChange={setSearch}
              onCategoryChange={setCategory}
              onRefresh={refreshEvents}
            />
            <CreateEventForm
              form={form}
              categories={CATEGORIES}
              isSubmitting={isSubmitting}
              error={error}
              notice={notice}
              onChange={updateForm}
              onSubmit={submitEvent}
            />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App