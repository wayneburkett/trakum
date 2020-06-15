import React, { useContext } from 'react'
import { PageSpecForm } from './PageSpecForm'
import { GlobalContext } from '../context/GlobalState'

export const EditPage = () => {
  const { currentUrl, tabId, currentPage } = useContext(GlobalContext)

  return (
    <div>
      <span><b>ID</b>: {currentPage.data.id}</span><br />
      <span><b>Created</b>: {currentPage.data.created}</span><br />
      <br />
      <PageSpecForm />
    </div>
  )
}
