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

  const { currentPage, selectKey } = useContext(GlobalContext)
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
    selectKey('start')
    if (e) {
      e.stopPropagation()
    }
  }

  const render = ({ key = 'start', data = {} }) => {
    console.log(key, data)
    switch (key) {
      case 'start':
        return <span>first</span>
      case 'next':
        return <span>next</span>
      default:
        return <></>
    }
  }

  return (
    <div id="t-content-script" ref={ref}>
      <div>
        <span>{hasMovedCursor && displayQuery
        ? `${displayQuery}`
        : `${defaultDisplayMessage}`}</span>
      </div>
      {lockedQuery &&
        (<div>
          <Button variant="danger" onClick={reset}>Reset</Button>
          <Button variant="secondary" onClick={e => selectKey('next')}>Next</Button>
        </div>)}
        <span>{render(currentPage)}</span>
    </div>
  )
}
