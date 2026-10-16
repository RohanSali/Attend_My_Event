function WelcomeBanner() {
  return (
    <section className="relative mt-[26px] flex min-h-[270px] items-center justify-between overflow-hidden rounded-[13px] bg-[#17324d] px-[50px] py-[34px] text-white before:absolute before:-top-[264px] before:right-[68px] before:size-[370px] before:rounded-full before:border before:border-white/10 before:content-[''] after:absolute after:-right-[176px] after:-bottom-[270px] after:size-[460px] after:rounded-full after:border after:border-white/10 after:content-[''] max-[680px]:min-h-[235px] max-[680px]:px-[23px] max-[680px]:py-[27px] max-[420px]:min-h-[225px] max-[420px]:px-[17px] max-[420px]:py-[23px]">
      <div className="relative z-10">
        <p className="flex items-center gap-2 text-[10px] font-bold tracking-[1.25px] text-[#d1dce6]">
          <span className="size-[7px] rounded-full bg-[#f4a340] shadow-[0_0_0_4px_rgb(244_163_64_/_16%)]" />
          GOOD THINGS HAPPEN TOGETHER
        </p>
        <h1 className="mt-[17px] mb-2 text-[clamp(39px,5vw,57px)] leading-[1.05] font-semibold tracking-[-2.8px] max-[680px]:text-[43px] max-[420px]:text-4xl max-[420px]:tracking-[-2px]">
          Find your <span className="font-serif font-medium text-[#ffc46f] italic">people.</span>
        </h1>
        <p className="mt-[15px] max-w-[400px] text-sm leading-[1.65] text-[#d3dde6] max-[680px]:max-w-[290px] max-[680px]:text-xs">
          Make a plan, meet your community, and find something worth showing up for.
        </p>
      </div>
      <div
        className="relative z-10 mr-[45px] flex size-[150px] rotate-[8deg] shrink-0 flex-col items-center justify-center rounded-full border border-white/40 text-[8px] font-bold tracking-[1.5px] text-[#dae3eb] max-[850px]:mr-[10px] max-[680px]:mr-0 max-[680px]:ml-[10px] max-[680px]:size-[98px] max-[680px]:text-[6px] max-[420px]:ml-0 max-[420px]:size-[76px] max-[420px]:text-[5px]"
        aria-hidden="true"
      >
        <span>YOUR NEXT</span>
        <strong className="my-2 text-center font-serif text-[26px] leading-[0.96] font-medium tracking-[-0.7px] text-white max-[680px]:text-[19px] max-[420px]:text-[15px]">
          great<br />day out
        </strong>
        <span>STARTS HERE ↘</span>
      </div>
    </section>
  )
}

export default WelcomeBanner
