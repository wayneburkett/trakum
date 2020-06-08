import React from 'react'
import { PageSpecListItem } from './PageSpecListItem'

export const PageSpecList = ({ pageSpecs, title }) => {
  return (
    <>
      <h3>{title}</h3>
      {(pageSpecs && pageSpecs.length > 0)
        ? (
          <ul className='page-spec-list' style={{ 'list-style-type': 'none', 'padding-left': 3 }}>
            {pageSpecs.map(spec => (<PageSpecListItem pageSpec={spec} />))}
          </ul>)
        : (<span>There is nothing here.</span>)}
    </>
  )
}
