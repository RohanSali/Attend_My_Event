import { CATEGORIES } from '../constants/events.js'
import EmptyState from './EmptyState.jsx'
import EventCard from './EventCard.jsx'

function EventsSection({
  events,
  visibleEvents,
  search,
  category,
  isLoading,
  loadError,
  onSearchChange,
  onCategoryChange,
  onRefresh,
}) {
  return (
    <section className="min-w-0" aria-labelledby="events-heading">
      <div className="mb-[18px] flex min-h-[53px] items-center justify-between">
        <div>
          <p className="m-0 flex items-center gap-2 text-[10px] font-bold tracking-[1.25px] text-[#778595]">
            OUT IN THE WORLD
          </p>
          <h2 id="events-heading" className="mt-1.5 mb-0 flex items-center gap-2.5 text-[23px] font-semibold tracking-[-0.7px] text-[#17324d]">
            Upcoming events
            <span className="grid size-[23px] place-items-center rounded-full bg-[#e8edf2] text-[11px] font-bold tracking-normal text-[#496176]">
              {events.length}
            </span>
          </h2>
        </div>
        <button
          className="flex items-center gap-[7px] rounded-md border-0 bg-transparent px-2.5 py-2 text-xs text-[#566778] hover:bg-[#e9eff4] disabled:cursor-wait disabled:opacity-60"
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <span className="text-[17px]" aria-hidden="true">↻</span> Refresh
        </button>
      </div>

      <div className="mb-[17px] flex gap-[9px] max-[420px]:flex-col">
        <label className="flex h-[42px] min-w-0 flex-1 items-center gap-[9px] rounded-[7px] border border-[#dce3ea] bg-white px-[11px] text-[#718094] focus-within:ring-2 focus-within:ring-[#8dbbd3]">
          <span className="text-[21px] leading-none" aria-hidden="true">⌕</span>
          <span className="sr-only">Search events</span>
          <input
            className="w-full min-w-0 border-0 bg-transparent p-0 text-xs text-[#26384a] outline-none placeholder:text-[#8b98a6]"
            type="search"
            placeholder="Try a place, event, or vibe"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <label className="sr-only" htmlFor="category-filter">Filter by category</label>
        <select
          className="w-[145px] rounded-[7px] border border-[#dce3ea] bg-white px-[9px] text-[11px] text-[#526273] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8dbbd3] max-[420px]:h-[38px] max-[420px]:w-full"
          id="category-filter"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option>All categories</option>
          {CATEGORIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      {loadError && (
        <p className="mb-3 rounded-md border border-[#efd1d2] bg-[#fff2f1] px-2.5 py-[9px] text-[11px] leading-[1.45] text-[#9c373d]" role="alert">
          {loadError}
        </p>
      )}
      {isLoading ? (
        <EmptyState icon="◌" title="Finding what’s happening…" >
          One moment while we check the event board.
        </EmptyState>
      ) : loadError && events.length === 0 ? (
        <EmptyState
          icon="!"
          title="We couldn’t reach the event board"
          action={
            <button
              className="mt-[15px] border-0 bg-transparent p-0 text-xs font-semibold text-[#2f6f96] hover:underline"
              type="button"
              onClick={onRefresh}
            >
              Try again
            </button>
          }
        >
          Check that the API is running, then try again.
        </EmptyState>
      ) : visibleEvents.length ? (
        <div className="grid gap-[11px]">
          {visibleEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      ) : (
        <EmptyState
          icon="✳"
          title={events.length ? 'No events match just yet' : 'It’s a little quiet here'}
          action={
            <a className="mt-[15px] text-xs font-semibold text-[#2f6f96] hover:underline" href="#host">
              Create the first event <span aria-hidden="true">↗</span>
            </a>
          }
        >
          {events.length
            ? 'Try another search or category, or be the first to add something.'
            : 'Be the first to bring people together. Your event will show up here.'}
        </EmptyState>
      )}
      <p className="mt-4 mb-4 text-[10px] text-[#8a96a2]">
        {events.length === 0 ? 'A little space for your next big idea.' : 'Good plans are even better shared.'}
      </p>
    </section>
  )
}

export default EventsSection
