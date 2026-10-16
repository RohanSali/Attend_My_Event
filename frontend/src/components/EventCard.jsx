import { formatEventDate } from '../utils/events.js'

function EventCard({ event }) {
  return (
    <article className="rounded-[9px] border border-[#dce3ea] bg-white px-[18px] py-4 transition-[transform,border-color,box-shadow] duration-150 hover:-translate-y-px hover:border-[#b9d0df] hover:shadow-[0_6px_18px_rgb(30_53_73_/_5%)]">
      <div className="flex items-center justify-between gap-2.5 max-[420px]:items-start max-[420px]:flex-col max-[420px]:gap-[5px]">
        <span className="inline-flex items-center gap-[7px] text-[10px] font-bold text-[#2f6f96]">
          <span className="size-[7px] rounded-full bg-[#f4a340]" aria-hidden="true" />
          {event.category}
        </span>
        <span className="text-right text-[10px] font-medium text-[#67788a] max-[420px]:text-left">
          {formatEventDate(event.starts_at)}
        </span>
      </div>
      <h3 className="mt-[11px] mb-[7px] text-base font-semibold tracking-[-0.25px] text-[#243a50]">
        {event.title}
      </h3>
      <p className="m-0 flex items-center gap-1.5 text-xs text-[#576c7f]">
        <span className="text-base text-[#c58229]" aria-hidden="true">⌖</span>
        {event.venue}
      </p>
      {event.description && (
        <p className="mt-[11px] mb-[3px] wrap-anywhere text-xs leading-[1.55] text-[#667687]">
          {event.description}
        </p>
      )}
      <p className="mt-[9px] mb-0 text-[10px] text-[#8996a3]">
        Until {formatEventDate(event.ends_at)}
      </p>
    </article>
  )
}

export default EventCard
