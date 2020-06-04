import React, { useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'
import { MatchPattern } from '../util/MatchPattern'

export const CurrentPage = () => {
  const { currentUrl, pageSpecs } = useContext(GlobalContext)

  const getMatches = (patterns, url) => {
    return (patterns && url)
      ? patterns.filter(item => MatchPattern(item.pattern)(url))
      : []
  }

  const matches = getMatches(pageSpecs, currentUrl)

  return (
    <>
      {(matches && matches.length > 0)
        ? (
          <ul className='page-spec-list'>
            {matches.map(spec => (<li>{spec.pattern}</li>))}
          </ul>)
        : (<span>There is nothing here.</span>)}
    </>
  )
}
