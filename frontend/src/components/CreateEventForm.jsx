function CreateEventForm({
  form,
  categories,
  isSubmitting,
  error,
  notice,
  onChange,
  onSubmit,
}) {
  const labelClass = 'grid gap-1.5 text-[10px] font-semibold text-[#3e5368]'
  const inputClass = 'h-[37px] w-full min-w-0 rounded-md border border-[#d4dfe6] bg-white px-2.5 text-[11px] font-normal text-[#26384a] placeholder:text-[#9aa5af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8dbbd3]'

  return (
    <aside
      className="mt-0 rounded-[11px] border border-[#d9e4ea] bg-[#edf3f6] px-[22px] pt-[23px] pb-5 max-[680px]:mt-[5px]"
      id="host"
    >
      <p className="m-0 text-[10px] font-bold tracking-[1.25px] text-[#778595]">
        BRING EVERYONE TOGETHER
      </p>
      <h2 className="mt-[9px] mb-[9px] text-[26px] leading-[1.12] font-semibold tracking-[-1.15px] text-[#17324d]">
        Put it on<br />the calendar.
      </h2>
      <p className="m-0 text-[11px] leading-[1.6] text-[#617286]">
        Got a good thing coming up? Give people a reason to get out there.
      </p>

      <form className="mt-[21px] grid gap-3" onSubmit={onSubmit}>
        <label className={labelClass}>
          Event name
          <input
            className={inputClass}
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="e.g. Sunday morning run"
            minLength="3"
            maxLength="100"
            required
          />
        </label>
        <label className={labelClass}>
          Category
          <select className={inputClass} name="category" value={form.category} onChange={onChange}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className={labelClass}>
          Where are we meeting?
          <input
            className={inputClass}
            name="venue"
            value={form.venue}
            onChange={onChange}
            placeholder="Venue or address"
            minLength="2"
            maxLength="160"
            required
          />
        </label>
        <div className="grid grid-cols-2 gap-[9px]">
          <label className={labelClass}>
            Starts
            <input
              className={`${inputClass} px-[7px] text-[10px]`}
              type="datetime-local"
              name="starts_at"
              value={form.starts_at}
              onChange={onChange}
              required
            />
          </label>
          <label className={labelClass}>
            Ends
            <input
              className={`${inputClass} px-[7px] text-[10px]`}
              type="datetime-local"
              name="ends_at"
              value={form.ends_at}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <label className={labelClass}>
          <span>A few details <span className="ml-[3px] text-[9px] font-normal text-[#8996a2]">Optional</span></span>
          <textarea
            className="min-h-[68px] w-full resize-y rounded-md border border-[#d4dfe6] bg-white px-2.5 py-[9px] text-[11px] font-normal text-[#26384a] placeholder:text-[#9aa5af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8dbbd3]"
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="What should people know?"
            rows="3"
            maxLength="2000"
          />
        </label>
        {error && (
          <p className="m-0 rounded-md border border-[#efd1d2] bg-[#fff2f1] px-2.5 py-[9px] text-[11px] leading-[1.45] text-[#9c373d]" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="m-0 rounded-md bg-[#e0f2e9] px-2.5 py-[9px] text-[11px] leading-[1.45] text-[#176c51]" role="status">
            {notice}
          </p>
        )}
        <button
          className="flex min-h-[42px] items-center justify-between rounded-md border-0 bg-[#2f6f96] px-[13px] text-xs font-semibold text-white transition-colors hover:bg-[#245b7c] disabled:cursor-wait disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding your event…' : 'Add your event'}
          {!isSubmitting && <span className="text-[17px]" aria-hidden="true">↗</span>}
        </button>
        <p className="mt-[-4px] m-0 text-[9px] leading-[1.45] text-[#7b8995]">
          Keep it simple. You can share the details with everyone after.
        </p>
      </form>
    </aside>
  )
}

export default CreateEventForm
