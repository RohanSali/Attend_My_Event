import React, { useState } from 'react'

const OfferPalate = () => {
  const [state, setState] = useState(true);

  return (
    <div className='flex justify-center items-center'>
      { state && (
        <h3 className='text-sm text-amber-600 font-bold' onClick={() => {setState(false)}}>Currently running offers!!!</h3>
      )
      }
    </div>
  )
}

export default OfferPalate
