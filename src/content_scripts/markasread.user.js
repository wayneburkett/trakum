import { MatchPattern } from '../util/MatchPattern'
import { MessageRouter } from '../util/MessageRouter'
import { Storage } from '../util/Storage'

const md5 = require('md5')

const makeCommentRunner = () => {
  let comments = null
  return (query) => {
    if (comments) comments.forEach(comment => comment.classList.remove('trakum_test'))
    comments = getComments(query, {}, true)
  }
}

const commentRunner = makeCommentRunner()

chrome.runtime.onMessage.addListener((message, sender, response) => {
  const { action, payload } = message
  switch (action) {
    case 'TEST_MATCH_PATTERN':
      try {
        commentRunner(payload)
      } catch (e) {
        // ignore
      }
      response({})
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

function getViewportHeight () {
  return Math.min(document.documentElement.clientHeight, document.body.clientHeight)
}

function getScrollTop () {
  return Math.max(document.documentElement.scrollTop, document.body.scrollTop)
}

function getCurrentCoverage () {
  var _top = getScrollTop()
  return { top: _top, bottom: _top + getViewportHeight() }
}

function getOffset (el) {
  var left = 0; var top = 0
  while (el.offsetParent) {
    left += el.offsetLeft
    top += el.offsetTop
    el = el.offsetParent
  }
  return [left, top]
}

function getY (el) {
  return getOffset(el)[1]
}

// execute callback only after a pause in user input; the function returned
// can be used to handle an event type that tightly repeats (such as typing
// or scrolling events); it will execute the callback only if the given timout
// period has passed since the last time the same event fired
function createOnPause (timeout, callback) {
  let timer = null
  return function (e) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(callback, timeout)
  }
}

// mark all comments currently scrolled into view
function markCurrent (comments) {
  var coverage = getCurrentCoverage()
  for (var i = 0; i < comments.length && comments[i][1] <= coverage.bottom; i++) {
    var curr = comments[i]
    if (curr[1] >= coverage.top && !curr[0].seen) {
      curr[0].seen = true
      markElement(curr[0])
    }
  }
}

function processElementNode (element, cache) {
  var id = md5(element.textContent)
  if (cache[id]) {
    element.seen = true
    markElement(element)
  } else {
    element.classList.add('trakum_new')
  }
  element.classList.add('trakum_element')
  return [element, getY(element), id]
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
    .filter(([element]) => element.seen)
    .map(([,, id]) => id)
    .toString())
}

function getPreviouslyMarked (page, callback) {
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

function getMatches (patterns, url) {
  return patterns.filter(item => MatchPattern(item.pattern)(url))
}

function updateCount (comments) {
  const newIds = comments
    .filter(([el]) => !el.seen)
    .map(([,, id]) => id)
  MessageRouter.sendMessage('UPDATE_COUNT', newIds)
}

function getMatchPatterns (callback) {
  MessageRouter.sendMessage('GET_MATCH_PATTERNS', null, callback)
}

function handlePage (page) {
  getPreviouslyMarked(page, function (cache) {
    const comments = getComments(page.query, cache)
    updateCount(comments)
    document.addEventListener('scroll', createOnPause(1500, function () {
      markCurrent(comments)
      saveMarked(page, comments)
      updateCount(comments)
    }), false)
  })
}

window.addEventListener('load', function () {
  getMatchPatterns((response) => {
    if (!response) return
    getMatches(response, window.location).forEach(handlePage)
  })
}, false)

// 2020-05-14 - 0.2 - convert to a chrome extension
// 2008-12-12 - 0.1 - released
