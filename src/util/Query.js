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

export function select (query, callback) {
  if (!query) return []
  const results = (query.startsWith('/') ? xpath : css)(query)
  return (typeof (callback) === 'function') ? results.map(callback) : results
}

export const makeQueryRunner = function (className) {
  let items = null

  return (query, callback) => {
    if (items) items.forEach(el => el.classList.remove(className))
    items = select(query, el => {
      el.classList.add(className)
      return el
    })
    return items.length
  }
}
