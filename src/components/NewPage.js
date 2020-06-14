import React from 'react'
import { PageSpecForm } from './PageSpecForm'
import { FormAlert } from './FormAlert'

export const NewPage = () => {
  return (
    <div>
      <FormAlert />
      <PageSpecForm />
    </div>
  )
}
