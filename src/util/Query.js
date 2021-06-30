function css (selector) {
  return Array.from(document.querySelectorAll(selector))
}

function xpath (query) {
  const result = document.evaluate(query, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  return Array(result.snapshotLength)
    .fill(0)
    .map((node, index) => result.snapshotItem(index))
    .filter(node => node.nodeType === Node.ELEMENT_NODE)
}

/**
 * Selects elements on the page matching the given XPath or CSS selector and optionally
 * applies a callback to each element
 *
 * @param query string the selector
 * @param callback function an optional function to apply to each selected element
 * @access public
 * @return array an array of selected items
 */
export function select (query, callback) {
  if (!query) return []
  const results = (query.startsWith('/') ? xpath : css)(query)
  return (typeof (callback) === 'function') ? results.map(callback) : results
}

/**
 * Creates a query function that closes over the given class name. The function returned
 * takes a query, removes the closed-over class name from all elements on the page, and
 * then adds the class name to all elements selected by the query.
 *
 * @param className string
 * @access public
 * @return function a function that takes a query and applies the given className to all elements selected by it
 */
export const makeQueryRunner = function (className) {
  let items = null

  return (query) => {
    if (items) items.forEach(el => el.classList.remove(className))
    items = select(query, el => {
      el.classList.add(className)
      return el
    })
    return items.length
  }
}
