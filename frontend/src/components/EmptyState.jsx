function EmptyState({ icon, title, children, action }) {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center rounded-[9px] border border-dashed border-[#cbd5df] bg-white/60 p-[30px] text-center">
      <span
        className="grid size-[39px] place-items-center rounded-[13px] bg-[#fff2df] text-[23px] text-[#b27428]"
        aria-hidden="true"
      >
        {icon}
      </span>
      <h3 className="mt-[13px] mb-[5px] text-base font-semibold text-[#17324d]">{title}</h3>
      <p className="m-0 max-w-[310px] text-xs leading-[1.6] text-[#657384]">{children}</p>
      {action}
    </div>
  )
}

export default EmptyState
