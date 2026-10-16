function SiteFooter() {
  return (
    <footer className="flex min-h-[68px] items-center justify-between border-t border-[#dce3ea] text-[10px] text-[#788694]">
      <a className="inline-flex items-center gap-[9px] text-[13px] font-bold tracking-[-0.7px] text-[#52677b]" href="#">
        <span
          className="grid size-6 place-items-center rounded-[8px_8px_8px_3px] bg-[#2f6f96] text-[17px] font-bold tracking-[-2px] text-white"
          aria-hidden="true"
        >
          a
        </span>
        <span>attend<span className="font-medium text-[#2f6f96]">my</span>event</span>
      </a>
      <span>Show up for something good.</span>
    </footer>
  )
}

export default SiteFooter
