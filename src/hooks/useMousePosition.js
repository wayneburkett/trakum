import { useState, useEffect } from 'react'
import { createSelector } from '../util/Selectors'

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null })

  const updateMousePosition = ev => {
    const currentSelector = createSelector(ev.target)
    setMousePosition({ x: ev.clientX, y: ev.clientY, sel: currentSelector })
  }

  useEffect(() => {
    window.addEventListener('mouseover', updateMousePosition)

    return () => window.removeEventListener('mouseover', updateMousePosition)
  }, [])

  return mousePosition
}

export default useMousePosition
