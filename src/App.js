import React, { useContext, useEffect, useRef } from 'react'
import './css/App.css'
import { BrowserAction } from './components/BrowserAction'
import { ContentScript } from './components/ContentScript'
import { GlobalContext } from './context/GlobalState'
import { isContentScript } from './util/Chrome'

function App () {
  const { getCurrentTabInfo, getPageSpecs } = useContext(GlobalContext)

  useEffect(() => getCurrentTabInfo(), [])
  useEffect(() => getPageSpecs(), [])

  const render = () => {
    return isContentScript()
      ? <ContentScript />
      : <BrowserAction />
  }

  return (
    <div className='App'>
      {render()}
    </div>
  )
}

export default App
