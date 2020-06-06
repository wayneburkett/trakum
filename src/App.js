import React, { useContext, useEffect } from 'react'
import './css/App.css'
import { BrowserAction } from './components/BrowserAction'
import { Navigation } from './components/Navigation'
import { GlobalContext } from './context/GlobalState'

function App () {
  const { getCurrentTabInfo } = useContext(GlobalContext)

  useEffect(() => getCurrentTabInfo(), [])

  return (
    <div className='App'>
      <Navigation />
      <BrowserAction />
    </div>
  )
}

export default App
