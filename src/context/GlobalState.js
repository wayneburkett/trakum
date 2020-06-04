import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';

const initialState = {
  pageSpecs: [
    {
      pattern: "https://news.ycombinator.com/item?id=*",
      query: "//div[@class='comment']",
    },
    {
      pattern: "https://www.doctorofcredit.com/best-bank-account-bonuses/",
      query: "//ul[@class='toc_list']/li/ul/li",
      dry: false
    }
  ],
  selectedKey: 'current'
}

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  function selectKey(key) {
    dispatch({
      type: 'SELECT_KEY',
      payload: key
    });
  }

  function addPageSpec(pageSpec) {
    dispatch({
      type: 'ADD_PAGE_SPEC',
      payload: pageSpec
    });
  }

  return (<GlobalContext.Provider value={{
    selectedKey: state.selectedKey,
    pageSpecs: state.pageSpecs,
    addPageSpec,
    selectKey
  }}>
    {children}
  </GlobalContext.Provider>);
}

