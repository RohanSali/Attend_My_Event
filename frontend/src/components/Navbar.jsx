function Navbar() {
  return (
    <header className="flex h-[78px] items-center border-b border-[#dce3ea] max-[680px]:h-[66px]">
      <a
        className="inline-flex items-center gap-[9px] text-[17px] font-extrabold tracking-[-0.7px] text-[#17324d] max-[420px]:gap-1.5 max-[420px]:text-sm"
        href="#"
        aria-label="AttendMyEvent home"
      >
        <span
          className="grid size-[30px] shrink-0 place-items-center rounded-[10px_10px_10px_3px] bg-[#2f6f96] text-[21px] font-bold tracking-[-2px] text-white max-[420px]:size-[26px] max-[420px]:text-lg"
          aria-hidden="true"
        >
          a
        </span>
        <span>attend<span className="font-medium text-[#2f6f96]">my</span>event</span>
      </a>
      <nav className="ml-[74px] flex items-center gap-8 text-[13px] font-medium text-[#556575] max-[680px]:ml-auto max-[680px]:gap-[17px] max-[680px]:text-[11px] max-[420px]:gap-[11px] max-[420px]:text-[10px]" aria-label="Main navigation">
        <a className="py-2.5 text-[#17324d] shadow-[inset_0_-2px_#f4a340]" href="#explore">Explore</a>
        <a className="py-2.5 max-[680px]:hidden" href="#host">Host an event</a>
      </nav>
      <a
        className="ml-auto rounded-lg border border-[#d2e0e9] bg-white px-4 py-[11px] text-[13px] font-semibold text-[#17324d] transition-colors hover:border-[#a9c6d7] hover:bg-[#f3f8fb] max-[680px]:ml-[14px] max-[680px]:px-2.5 max-[680px]:py-[9px] max-[680px]:text-[11px] max-[420px]:ml-2 max-[420px]:p-2 max-[420px]:text-[10px]"
        href="#host"
      >
        + Create event
      </a>
    </header>
  )
}

export default Navbar
