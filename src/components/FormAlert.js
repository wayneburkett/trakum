import React from 'react'
import Alert from 'react-bootstrap/Alert'
import { openUrl, getPopup } from '../util/Chrome'

export const FormAlert = () => {
  const handleLinkClick = e => {
    const popup = getPopup()
    popup && popup.close()
    openUrl(e.target.href)
  }

  return (
    <Alert variant='info'>
      <p>Specify a <i><a href='https://developer.chrome.com/extensions/match_patterns' onClick={handleLinkClick}>Match Pattern</a></i> that determines which pages to track and a query that specifies the trackable elements.</p>
    </Alert>
  )
}
