import React, { useContext } from 'react'
import { AllPage } from './AllPage'
import { CurrentPage } from './CurrentPage'
import { EditPage } from './EditPage'
import { NewPage } from './NewPage'
import { GlobalContext } from '../context/GlobalState'

export function BrowserAction () {
  const { currentPage } = useContext(GlobalContext)

  const render = ({ key, data = {} }) => {
    switch (key) {
      case 'current':
        return <CurrentPage />
      case 'all':
        return <AllPage />
      case 'edit':
        return <EditPage />
      case 'new':
        return <NewPage />
      default:
        return <></>
    }
  }

  return (
    <div className='page'>
      {render(currentPage)}
    </div>
  )
}
