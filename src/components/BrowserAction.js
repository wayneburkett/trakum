import React, { useContext } from 'react'
import PageSpecForm from './PageSpecForm'
import { All } from './All'
import { CurrentPage } from './CurrentPage'
import { GlobalContext } from '../context/GlobalState'

export function BrowserAction () {
  const { selectedKey } = useContext(GlobalContext)

  const render = (key) => {
    switch (key) {
      case 'current':
        return <CurrentPage />
      case 'all':
        return <All />
      case 'new':
        return <PageSpecForm />
      default:
        return <></>
    }
  }

  return (
    <div className='page'>
      {render(selectedKey)}
    </div>
  )
}
