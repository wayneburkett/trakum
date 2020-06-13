function getViewportHeight () {
  return Math.min(document.documentElement.clientHeight, document.body.clientHeight)
}

function getOffset (el) {
  const rect = el.getBoundingClientRect()
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  }
}

function getCurrentCoverage () {
  return {
    top: window.scrollY,
    bottom: window.scrollY + getViewportHeight()
  }
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
