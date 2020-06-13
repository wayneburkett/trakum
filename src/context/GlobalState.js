import React, { createContext, useReducer } from 'react'
import { MessageRouter } from '../util/MessageRouter'
import { getCurrentTab } from '../util/Chrome'
import AppReducer from './AppReducer'

const initialState = {
  pageSpecs: [],
  currentPage: { key: 'current', data: null },
  currentUrl: null,
  tabId: null
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState)

  function selectKey (key, data) {
    dispatch({
      type: 'SELECT_KEY',
      payload: { key, data }
    })
  }

  function getPageSpecs () {
    MessageRouter.sendMessage('GET_MATCH_PATTERNS', null, (pageSpecs) => {
      dispatch({
        type: 'GET_PAGE_SPECS',
        payload: { pageSpecs }
      })
    })
  }

  function addPageSpec (pageSpec) {
    MessageRouter.sendMessage('ADD_PAGE_SPEC', pageSpec, (pageSpecs) => {
      dispatch({
        type: 'ADD_PAGE_SPEC',
        payload: { pageSpec, pageSpecs }
      })
    })
  }

  function editPageSpec (pageSpec) {
    MessageRouter.sendMessage('EDIT_PAGE_SPEC', pageSpec, (pageSpecs) => {
      dispatch({
        type: 'EDIT_PAGE_SPEC',
        payload: { pageSpec, pageSpecs }
      })
    })
  }

  function deletePageSpec (pageSpec) {
    MessageRouter.sendMessage('DELETE_PAGE_SPEC', pageSpec, (pageSpecs) => {
      dispatch({
        type: 'DELETE_PAGE_SPEC',
        payload: { pageSpec, pageSpecs }
      })
    })
  }

  function getCurrentTabInfo () {
    getCurrentTab(tab => {
      dispatch({
        type: 'GET_CURRENT_URL',
        payload: tab
      })
    })
  }

  return (<GlobalContext.Provider value={{
    currentPage: state.currentPage,
    pageSpecs: state.pageSpecs,
    currentUrl: state.currentUrl,
    tabId: state.tabId,
    getPageSpecs,
    addPageSpec,
    editPageSpec,
    deletePageSpec,
    selectKey,
    getCurrentTabInfo
  }}
  >
    {children}
  </GlobalContext.Provider>)
}
