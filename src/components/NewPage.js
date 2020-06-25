import React from 'react'
import { PageSpecForm } from './PageSpecForm'
import { FormAlert } from './FormAlert'
import { openUrl, getPopup } from '../util/Chrome'

export const NewPage = () => {
  const handleLinkClick = e => {
    const popup = getPopup()
    popup && popup.close()
    openUrl(e.target.href)
  }

  return (
    <div>
      <FormAlert>
        <p>Specify a <i><a href='https://developer.chrome.com/extensions/match_patterns' onClick={handleLinkClick}>Match Pattern</a></i> that determines which pages to track and a query that specifies the trackable elements.</p>
      </FormAlert>
      <PageSpecForm />
    </div>
  )
}
