import React from 'react'
import Swap from '../views/Swap'

const SwapPage = () => {
  return <Swap />
}

// We show Chart by default, will affect layout shift if user hide it in preference
SwapPage.ssr = false

export default SwapPage
