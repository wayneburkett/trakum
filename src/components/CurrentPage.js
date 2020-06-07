import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'
import { MatchPattern } from '../util/MatchPattern'
import { PageSpecList } from './PageSpecList'

export const CurrentPage = () => {
  const { currentUrl, pageSpecs } = useContext(GlobalContext)

  const getMatches = (patterns, url) => {
    return (patterns && url)
      ? patterns.filter(item => MatchPattern(item.pattern)(url))
      : []
  }

  const matches = getMatches(pageSpecs, currentUrl)

  return (
    <div>
      <PageSpecList title='Matches' pageSpecs={matches} />
    </div>
  )
}
