import { useState, useEffect } from 'react'
import { createSelector } from '../util/Selectors'

const useSelectorCreator = (eventName = 'mouseover', toggle = false) => {
  const [selector, setSelector] = useState({ x: null, y: null, sel: null })

  const updateSelector = ev => {
    const currentSelector = (toggle && selector.sel) ? null : createSelector(ev.target)
    setSelector({ x: ev.clientX, y: ev.clientY, sel: currentSelector })
    ev.preventDefault()
  }

  useEffect(() => {
    window.addEventListener(eventName, updateSelector)
    return () => window.removeEventListener(eventName, updateSelector)
  }, [])

  return selector
}

export default useSelectorCreator
