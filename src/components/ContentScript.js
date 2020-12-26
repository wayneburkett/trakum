import React, { useContext, useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import useSelectorCreator from '../hooks/useSelectorCreator'
import { MessageRouter } from '../util/MessageRouter'
import { GlobalContext } from '../context/GlobalState'

export const ContentScript = () => {
  const { x, y, sel: query } = useSelectorCreator('mouseover')
  const { sel: selector2 } = useSelectorCreator('click', true)
  const hasMovedCursor = typeof x === 'number' && typeof y === 'number'

  const handleClick = ev => {
    ev.preventDefault()
  }

  useEffect(() => {
    applyTestQuery(query, response => {})
    return () => applyTestQuery('')
  }, [query])

  const applyTestQuery = (query, callback) => {
    MessageRouter.sendMessage('TEST_QUERY', query, response => {
      if (callback && response) callback(response)
    })
  }

  return (
    <div id="t-content-script" onClick={handleClick}>
      {hasMovedCursor
        ? `${selector2} and ${query}`
        : 'Move your mouse'}
      <Button as="input" type="reset" value="Reset" onClick={handleClick} />
    </div>
  )
}
