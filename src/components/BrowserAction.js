import React, { useContext } from "react";
import PageSpecForm from './PageSpecForm'
import { PageSpecList } from './PageSpecList'
import { CurrentPage } from './CurrentPage'
import { GlobalContext } from '../context/GlobalState'

export function BrowserAction() {
  const { selectedKey } = useContext(GlobalContext)

  const render = (key) => {
    switch (key) {
      case 'current':
        return <CurrentPage />
      case 'all':
        return <PageSpecList />
      case 'new':
        return <PageSpecForm />
      default:
        return <></>
    }
  }

  return (
    <div className="page">
      {render(selectedKey)}
    </div>
  );
}
