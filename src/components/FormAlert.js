import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import { openUrl, getPopup } from '../util/Chrome'

export const FormAlert = () => {
  const handleLinkClick = e => {
    const popup = getPopup()
    popup && popup.close()
    openUrl(e.target.href)
  }

  return (
    <>
      <Alert variant='info'>
        <Alert.Heading>Create a New Page Spec</Alert.Heading>
        <p>Specs must have a <i><a href='https://developer.chrome.com/extensions/match_patterns' onClick={handleLinkClick}>Match Pattern</a></i> that determines which pages they apply to.</p>
        <p>Specs must also include a <i>Query</i> that specifies which elements to track. Queries that start with a forward slash (/) will be treated as XPath; all other queries are assumed to be CSS.</p>
      </Alert>
    </>
  )
}
