import { MessageRouter } from '../util/MessageRouter'
import { Storage } from '../util/Storage'
import { addCoverageListener } from '../util/ScreenCoverage'
import { addListener } from '../util/Chrome'

const md5 = require('md5')

const commentRunner = (function () {
  const testClass = 'trakum_test'
  let items = null

  return (query) => {
    if (items) items.forEach(item => item.element.classList.remove(testClass))
    items = select(query, testClass)
    return items.length
  }
})()

addListener((message, sender, response) => {
  const { action, payload } = message
  switch (action) {
    case 'TEST_MATCH_PATTERN':
      let count = 0
      try {
        count = commentRunner(payload)
      } catch (e) {
        // ignore
      }
      response({ count })
      break
    default:
      response('unknown request')
      break
  }
})

function select (query, className = 'trakum_new') {
  const result = document.evaluate(query, document, null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  const items = []
  for (let i = 0; i < result.snapshotLength; i++) {
    const node = result.snapshotItem(i)
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        items.push(createItem(node, className))
        break
      default:
        break
    }
  }
  return items
}

function createItem (element, className) {
  element.classList.add(className)
  return {
    id: md5(element.textContent),
    element,
    seen: false
  }
}

function markVisited (el) {
  el.classList.remove('trakum_new')
  el.classList.add('trakum_seen')
}

class Tracker {
  constructor (page) {
    this._page = page
    this._pageKey = document.location.href
    this._items = select(page.query)
  }

  get visited () {
    return this._items.filter(item => item.seen)
  }

  getCachedItems (cache = {}) {
    return this._items.filter(item => cache[item.id])
  }

  start () {
    this._get(cache => {
      this._update(this.getCachedItems(cache))
      addCoverageListener(1500, this._items, (visible) => {
        this._update(visible, true)
      })
    })
  }

  _update (items = [], save = false) {
    items.forEach(item => {
      item.seen = true
      markVisited(item.element)
    })
    updateCount(this._items)
    if (save) this._save()
  }

  _get (callback) {
    Storage.get(this._pageKey, (items = []) => {
      var seen = {}
      items.forEach(id => seen[id] = true)
      callback(seen)
    })
  }

  _save () {
    Storage.set(
      this._pageKey,
      this.visited.map(item => item.id))
  }
}

function updateCount (items) {
  const newIds = items
    .filter(item => !item.seen)
    .map(item => item.id)
  MessageRouter.sendMessage('UPDATE_COUNT', newIds)
}

function getMatchPatterns (callback) {
  MessageRouter.sendMessage('GET_MATCHING_MATCH_PATTERNS', window.location, callback)
}

getMatchPatterns((response = []) => response.forEach(page => {
  const tracker = new Tracker(page)
  tracker.start()
}))

// 2020-05-14 - 0.2 - converted to a chrome extension
// 2008-12-12 - 0.1 - released
