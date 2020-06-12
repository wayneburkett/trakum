import React, { useContext } from 'react'
import { PageSpecList } from './PageSpecList'
import { GlobalContext } from '../context/GlobalState'

export const AllPage = () => {
  const { pageSpecs } = useContext(GlobalContext)

  return (
    <div>
      <PageSpecList title='All Match Patterns' pageSpecs={pageSpecs} />
    </div>
  )
}
