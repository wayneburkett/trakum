import { useState, useEffect, useRef } from 'react'
import { createSelector } from '../util/Selectors'

const useSelectorCreator = (eventName = 'mouseover', ref) => {
  const [selector, setSelector] = useState({ x: null, y: null, sel: null })

  // I'm probably supposed to do something much more complicated with refs
  // here, but this seems to work just fine
  const root = document.getElementById('trakum-app')

  const updateSelector = ev => {
    if (root && root.contains(ev.target)) return
    const currentSelector = createSelector(ev.target)
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
