import React from 'react'
import Table from 'react-bootstrap/Table'
import { PageSpecListItem } from './PageSpecListItem'

export const PageSpecList = ({ pageSpecs, title }) => {
  const renderTable = (pageSpecs) => {
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <th colspan='2'>Match Patterns</th>
          </tr>
        </thead>
        <tbody>
          {pageSpecs.map(spec => (<PageSpecListItem pageSpec={spec} />))}
        </tbody>
      </Table>
    )
  }

  return (
    <>
    {title && (<h3>{title}</h3>)}
    {(pageSpecs && pageSpecs.length > 0)
        ? renderTable(pageSpecs)
        : <span>There is nothing here.</span>}
    </>
  )
}
