import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'

export const PageSpecList = () => {
  const { pageSpecs } = useContext(GlobalContext)

  return (
    <>
      <ul className='page-spec-list'>
        {pageSpecs && pageSpecs.map(spec => (<li>{spec.pattern}</li>))}
      </ul>
    </>
  )
}
