/* global chrome */

import React, { createContext, useReducer } from 'react'
import { MessageRouter } from '../util/MessageRouter'
import AppReducer from './AppReducer'

const initialState = {
  pageSpecs: [],
  selectedKey: 'current',
  currentUrl: null,
  tabId: null
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState)

  function selectKey (key) {
    dispatch({
      type: 'SELECT_KEY',
      payload: key
    })
  }

  function getPageSpecs () {
    MessageRouter.sendMessage('GET_MATCH_PATTERNS', null, (resp) => {
      dispatch({
        type: 'GET_PAGE_SPECS',
        payload: resp
      })
    })
  }

  function addPageSpec (pageSpec) {
    MessageRouter.sendMessage('ADD_PAGE_SPEC', pageSpec, (resp) => {
      dispatch({
        type: 'ADD_PAGE_SPEC',
        payload: pageSpec
      })
    })
  }

  function getCurrentTabInfo () {
    chrome.tabs.query({ active: true, currentWindow: true }, function ([tab]) {
      dispatch({
        type: 'GET_CURRENT_URL',
        payload: tab
      })
    })
  }

  return (<GlobalContext.Provider value={{
    selectedKey: state.selectedKey,
    pageSpecs: state.pageSpecs,
    currentUrl: state.currentUrl,
    tabId: state.tabId,
    getPageSpecs,
    addPageSpec,
    selectKey,
    getCurrentTabInfo
  }}
  >
    {children}
  </GlobalContext.Provider>)
}
