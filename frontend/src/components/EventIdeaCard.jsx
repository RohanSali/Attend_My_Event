import { useState } from 'react'
import { getRandomIdea } from '../api/ideas.js'

function EventIdeaCard() {
  const [idea, setIdea] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function findIdea() {
    setIsLoading(true)
    setError('')
    try {
      setIdea(await getRandomIdea())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not find an event idea.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      className="mt-5 flex items-center justify-between gap-5 rounded-[11px] border border-[#d9e4ea] bg-white px-5 py-4 max-[520px]:items-start max-[520px]:flex-col"
      aria-labelledby="event-idea-heading"
    >
      <div>
        <p className="m-0 text-[10px] font-bold tracking-[1.1px] text-[#778595]">
          NEED A LITTLE INSPIRATION?
        </p>
        <h2 id="event-idea-heading" className="mt-1.5 mb-0 text-base font-semibold text-[#17324d]">
          Try a fresh event idea
        </h2>
        {idea && (
          <div className="mt-2" aria-live="polite">
            <p className="m-0 text-sm font-medium text-[#2f6f96]">
              {idea.title} <span className="text-xs font-normal text-[#778595]">· {idea.category}</span>
            </p>
            <p className="mt-1 mb-0 text-xs leading-relaxed text-[#617286]">{idea.description}</p>
          </div>
        )}
        {error && <p className="mt-2 mb-0 text-xs text-[#9c373d]" role="alert">{error}</p>}
      </div>
      <button
        className="shrink-0 rounded-md border-0 bg-[#2f6f96] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#245b7c] disabled:cursor-wait disabled:opacity-70"
        type="button"
        onClick={findIdea}
        disabled={isLoading}
      >
        {isLoading ? 'Finding an idea…' : idea ? 'Another idea' : 'Surprise me'}
      </button>
    </section>
  )
}

export default EventIdeaCard
