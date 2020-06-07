import React from 'react'

export const PageSpecList = ({ pageSpecs, title }) => {
  return (
    <>
      <h3>{title}</h3>
      {(pageSpecs && pageSpecs.length > 0)
        ? (
          <ul className='page-spec-list'>
            {pageSpecs.map(spec => (<li>{spec.pattern}</li>))}
          </ul>)
        : (<span>There is nothing here.</span>)}
    </>
  )
}
