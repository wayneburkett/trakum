import { MessageRouter } from '../util/MessageRouter'
import { Storage } from '../util/Storage'
import { forEachVisibleElement, getY } from '../util/ScreenCoverage'

const md5 = require('md5')

const commentRunner = (function () {
  let comments = null
  return (query) => {
    if (comments) comments.forEach(comment => comment.classList.remove('trakum_test'))
    comments = getComments(query, {}, true)
    return comments.length
  }
})()

chrome.runtime.onMessage.addListener((message, sender, response) => {
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

function markElement (el) {
  el.classList.remove('trakum_new')
  el.classList.add('trakum_seen')
}

function debounce (timeout, callback) {
  let timer = null
  return function (e) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(callback, timeout)
  }
}

function processElementNode (element, cache) {
  var id = md5(element.textContent)
  if (cache[id]) {
    markElement(element)
  } else {
    element.classList.add('trakum_new')
  }
  element.classList.add('trakum_element')
  return {
    position: getY(element),
    element,
    id,
    seen: !!cache[id]
  }
}

function getComments (query, cache, dry = false) {
  var comments = document.evaluate(query, document, null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  var res = []
  for (var i = 0; i < comments.snapshotLength; i++) {
    var processedNode = null
    var node = comments.snapshotItem(i)
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (!dry) {
          processedNode = processElementNode(node, cache)
        } else {
          node.classList.add('trakum_test')
          processedNode = node
        }
        break
      default:
        // we can and probably should process other node types, but
        // it's only elements for now
        break
    }
    if (processedNode) {
      res.push(processedNode)
    }
  }
  return res
}

function pageKey () {
  if (!pageKey._value) pageKey._value = document.location.href
  return pageKey._value
}

function saveMarked (page, comments) {
  if (page.dry) return
  Storage.set(pageKey(), comments
    .filter(item => item.seen)
    .map(item => item.id)
    .toString())
}

function getSaved (page, callback) {
  if (page.dry) {
    return callback({})
  }
  Storage.get(pageKey(), function (items) {
    var seen = {}
    var ids = (items || '').split(',')
    for (var i = 0; i < ids.length; i++) {
      seen[ids[i]] = true
    }
    callback(seen)
  })
}

function updateCount (comments) {
  const newIds = comments
    .filter(item => !item.seen)
    .map(item => item.id)
  MessageRouter.sendMessage('UPDATE_COUNT', newIds)
}

function createScrollHandler (page, items) {
  document.addEventListener('scroll', debounce(1500, function () {
    forEachVisibleElement(items, (item) => {
      item.seen = true
      markElement(item.element)
    })
    saveMarked(page, items)
    updateCount(items)
  }), false)
}

function handlePage (page) {
  getSaved(page, function (cache) {
    const comments = getComments(page.query, cache)
    updateCount(comments)
    createScrollHandler(page, comments)
  })
}

function getMatchPatterns (callback) {
  MessageRouter.sendMessage('GET_MATCHING_MATCH_PATTERNS', window.location, callback)
}

getMatchPatterns((response = []) => response.forEach(handlePage))

// 2020-05-14 - 0.2 - converted to a chrome extension
// 2008-12-12 - 0.1 - released
