import React, { useContext } from 'react'
import { PageSpecForm } from './PageSpecForm'
import { GlobalContext } from '../context/GlobalState'

export const EditPage = () => {
  const { currentUrl, tabId, currentPage } = useContext(GlobalContext)

  console.log(currentPage.data)
  return (
    <div>
      <p>{currentPage.data.id}</p>
      <PageSpecForm />
    </div>
  )
}
