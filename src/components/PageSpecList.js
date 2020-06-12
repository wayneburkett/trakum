import React from 'react'
import Table from 'react-bootstrap/Table'
import { PageSpecListItem } from './PageSpecListItem'

export const PageSpecList = ({ pageSpecs, title }) => {
  const renderTable = () => {
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <th colspan='2'>{title}</th>
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
      {(pageSpecs && pageSpecs.length > 0)
        ? renderTable()
        : <span>There is nothing here.</span>}
    </>
  )
}
