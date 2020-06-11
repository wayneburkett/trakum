function getViewportHeight () {
  return Math.min(document.documentElement.clientHeight, document.body.clientHeight)
}

function getScrollTop () {
  return Math.max(document.documentElement.scrollTop, document.body.scrollTop)
}

function getOffset (el) {
  let top = 0
  let left = 0
  while (el.offsetParent) {
    left += el.offsetLeft
    top += el.offsetTop
    el = el.offsetParent
  }
  return { left, top }
}

function getCurrentCoverage () {
  const top = getScrollTop()
  return { top, bottom: top + getViewportHeight() }
}

function isVisible (el, coverage) {
  return el.position >= coverage.top && el.position <= coverage.bottom
}

/**
 * getY.
 *
 * @param {} el
 */
export function getY (el) {
  return getOffset(el).top
}

/**
 * Performs an action for each visible element.
 *
 * @param {} elements an array of objects each having element and position properties
 * @param {} fn the function to apply to each visible element
 */
export function forEachVisibleElement (elements = [], fn) {
  const coverage = getCurrentCoverage()
  elements
    .filter(item => (isVisible(item, coverage) && !item.seen))
    .forEach(fn)
}
