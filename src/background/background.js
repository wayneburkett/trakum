import { Trakum } from '../util/Trakum'
import { addListener, setBadgeText, addPageContextMenu } from '../util/Chrome'
import { MessageRouter } from '../util/MessageRouter'

const trakum = new Trakum()

addListener((message, sender, response) => {
  const { action, payload } = message
  switch (action) {
    case 'UPDATE_COUNT':
      setBadgeText(sender.tab.id, payload.length)
      response({})
      break
    case 'GET_MATCH_PATTERNS':
      response(trakum.pageSpecs)
      break
    case 'GET_MATCHING_MATCH_PATTERNS':
      response(trakum.matches(payload))
      break
    case 'ADD_PAGE_SPEC':
      trakum.addPageSpec(payload)
      response(trakum.pageSpecs)
      break
    case 'EDIT_PAGE_SPEC':
      trakum.updatePageSpec(payload)
      response(trakum.pageSpecs)
      break
    case 'DELETE_PAGE_SPEC':
      trakum.deletePageSpec(payload)
      response(trakum.pageSpecs)
      break
    case 'TEST_QUERY':
    case 'LOCK_TEST_QUERY':
    case 'RESET_TEST_QUERY':
      MessageRouter.sendMessageToTab(sender.tab.id, action, payload, response => {})
      response({})
      break
    default:
      response('unknown request')
      break
  }
})

addPageContextMenu('Mark all unread', (info = {}, tab = {}) => {
  if (!tab.id) return
  MessageRouter.sendMessageToTab(tab.id, 'MARK_ALL_UNREAD')
})

addPageContextMenu('Select from page', (info = {}, tab = {}) => {
  if (!tab.id) return
  // because we renamed the build output files to something predictable
  // in build.js, we can load them at will
  chrome.tabs.executeScript(tab.id, { file: './static/js/main.js' })
  chrome.tabs.insertCSS(tab.id, { file: './static/css/main.css' })
})
