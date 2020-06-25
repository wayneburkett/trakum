import React from 'react'
import Alert from 'react-bootstrap/Alert'

export const FormAlert = ({ children }) => {
  return (
    <Alert variant='info'>
      {children}
    </Alert>
  )
}
