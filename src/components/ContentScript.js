import React from 'react'
import useMousePosition from '../hooks/useMousePosition'

export const ContentScript = () => {
  const { x, y, sel } = useMousePosition()
  const hasMovedCursor = typeof x === 'number' && typeof y === 'number'

  return (
    <div>
      {hasMovedCursor
        ? `${sel}`
        : 'Move your mouse'}
    </div>
  )
}
