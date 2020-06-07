import React, { useContext } from 'react'
import { PageSpecList } from './PageSpecList'
import { GlobalContext } from '../context/GlobalState'

export const All = () => {
  const { pageSpecs } = useContext(GlobalContext)

  return (
    <div>
      <PageSpecList title='All' pageSpecs={pageSpecs} />
    </div>
  )
}
