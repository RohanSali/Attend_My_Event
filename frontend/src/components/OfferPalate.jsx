import React, { useState } from 'react'

const OfferPalate = () => {
  const [state, setState] = useState(true);
  const [buttonName, setButtonName] = useState('Click me');

  return (
    <div className='flex flex-col justify-center items-center'>
      { state && (
        <h3 className='text-sm text-amber-600 font-bold' onClick={() => {setState(false)}}>Currently running offers!!!</h3>
      )
      }
      <button onClick={() => setButtonName(buttonName === 'Click me' ? 'Clicked!' : 'Click me')}>
        {buttonName}
      </button>
    </div>
  )
}

export default OfferPalate
