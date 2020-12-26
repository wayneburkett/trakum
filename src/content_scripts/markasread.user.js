import { MessageRouter } from '../util/MessageRouter'
import { Storage } from '../util/Storage'
import { addCoverageListener } from '../util/ScreenCoverage'
import { addListener } from '../util/Chrome'
import { select, queryRunner } from '../util/Query'

const md5 = require('md5')

addListener((message, sender, response) => {
  const { action, payload } = message
  switch (action) {
    case 'TEST_QUERY':
      let count = 0
      try {
        count = queryRunner(payload)
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

function createItem (element, className) {
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

function markNew (el) {
  el.classList.remove('trakum_seen')
  el.classList.add('trakum_new')
}

class Tracker {
  constructor (page) {
    this._page = page
    this._storage = new TrackerStorage(this)
    this._items = this._getItems()
    this._configureChrome()
  }

  _getItems () {
    return select(this._page.query, el => {
      el.classList.add('trakum_new')
      return createItem(el)
    })
  }

  _configureChrome () {
    addListener((message, sender, response) => {
      const { action } = message
      switch (action) {
        case 'MARK_ALL_UNREAD':
          this._update(this.visited, false, true)
          response('ok')
          break
        default:
          response('unknown request')
          break
      }
    })
  }

  get visited () {
    return this._items.filter(item => item.seen)
  }

  get new () {
    return this._items.filter(item => !item.seen)
  }

  get created () {
    return this._created || (new Date()).toJSON()
  }

  getCachedItems (cache = {}) {
    return this._items.filter(item => cache[item.id])
  }

  start () {
    this._get(cache => {
      this._update(this.getCachedItems(cache))
      this._mark()
    })
  }

  _mark () {
    switch (this._page.markStrategy) {
      case 100:
        addCoverageListener(1500, this._items, (visible) => {
          this._update(visible, true, true)
        })
        break
      case 101:
      default:
        // TODO: this should be handled by the _update method below, but it'll
        // need to be refactored before that can happen
        this._items.forEach(item => item.seen = true)
        this._save()
        break
    }
  }

  _update (items = [], visited = true, save = false) {
    items.forEach(item => {
      item.seen = visited
      if (visited) {
        markVisited(item.element)
      } else {
        markNew(item.element)
      }
    })
    updateCount(this.new)
    if (save) this._save()
  }

  _get (callback) {
    this._storage.get(response => {
      this._created = response.created
      callback(response.seen)
    })
  }

  _save () {
    this._storage.save()
  }
}

class TrackerStorage {
  constructor (tracker) {
    this._tracker = tracker
    this._pageKey = '_' + document.location.href
  }

  get (callback) {
    Storage.get(this._pageKey, (response = {}) => {
      const { created, items = [] } = response
      const seen = items.reduce((acc, curr) => {
        acc[curr] = true
        return acc
      }, {})
      callback({ created, seen })
    })
  }

  save () {
    Storage.set(this._pageKey, {
      created: this._tracker.created,
      lastVisited: (new Date()).toJSON(),
      items: this._tracker.visited.map(item => item.id)
    })
  }
}

function updateCount (items) {
  const newIds = items.map(item => item.id)
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
