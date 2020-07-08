import React from 'react'
import ReactDOM from 'react-dom'
import './css/index.css'
import App from './App'
import { GlobalProvider } from './context/GlobalState'
import 'bootstrap/dist/css/bootstrap.min.css'

const anchor = document.createElement('div')
anchor.id = 'trakum-app'
document.body.insertBefore(anchor, document.body.childNodes[0])

ReactDOM.render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>,
  document.getElementById('trakum-app')
)
