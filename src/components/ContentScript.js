import React from 'react'
import Button from 'react-bootstrap/Button'
import useSelectorCreator from '../hooks/useSelectorCreator'

export const ContentScript = () => {
  const { x, y, sel: selector1 } = useSelectorCreator('mouseover')
  const { sel: selector2 } = useSelectorCreator('click', true)
  const hasMovedCursor = typeof x === 'number' && typeof y === 'number'

  const handleClick = ev => {
    ev.preventDefault()
  }

  return (
    <div onClick={handleClick}>
      {hasMovedCursor
        ? `${selector2} and ${selector1}`
        : 'Move your mouse'}
      <Button as="input" type="reset" value="Reset" onClick={handleClick} />
    </div>
  )
}
