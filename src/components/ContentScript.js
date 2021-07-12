import React, { useContext, useState, useEffect, useRef } from 'react'
import Button from 'react-bootstrap/Button'
import useSelectorCreator from '../hooks/useSelectorCreator'
import { MessageRouter } from '../util/MessageRouter'
import { GlobalContext } from '../context/GlobalState'

export const ContentScript = (root) => {
  const defaultDisplayMessage = 'Move your mouse'
  const ref = useRef()
  const { x, y, sel: query } = useSelectorCreator('mouseover', ref)
  const lockedQueryObj = useSelectorCreator('click', ref)
  const hasMovedCursor = typeof x === 'number' && typeof y === 'number'

  const [displayQuery, setDisplayQuery] = useState('')
  const [lockedQuery, setLockedQuery] = useState('')

  useEffect(() => {
    if (!lockedQuery) {
      applyTestQuery('TEST_QUERY', query, response => {})
      setDisplayQuery(query)
    }
    return () => applyTestQuery('')
  }, [query])

  useEffect(() => {
    if (lockedQuery) {
      reset()
    } else {
      const query = lockedQueryObj ? lockedQueryObj.sel : null
      applyTestQuery('LOCK_TEST_QUERY', query, response => {})
      setDisplayQuery(query)
      setLockedQuery(query)
    }
    return () => applyTestQuery('')
  }, [lockedQueryObj])

  const applyTestQuery = (msg, query, callback) => {
    // we could do some of this work here, but the problem is that we
    // might not always be doing this kind of work in a content script,
    // so it makes sense to push it out to a separate file and trigger
    // it via notification
    const payload = { query }
    MessageRouter.sendMessage(msg, payload, response => {
      if (callback && response) callback(response)
    })
  }

  const reset = (e) => {
    MessageRouter.sendMessage('RESET_TEST_QUERY', {}, response => {})
    setDisplayQuery(defaultDisplayMessage)
    setLockedQuery('')
    if (e) {
      e.stopPropagation()
    }
  }

  return (
    <div id="t-content-script" ref={ref}>
      {hasMovedCursor && displayQuery
        ? `${displayQuery}`
        : `${defaultDisplayMessage}`}
      <Button variant="primary" onClick={reset}>Reset</Button>
    </div>
  )
}
