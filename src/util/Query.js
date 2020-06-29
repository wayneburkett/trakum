
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

export const queryRunner = (function () {
  const testClass = 'trakum_test'
  let items = null

  return (query, callback) => {
    if (items) items.forEach(el => el.classList.remove(testClass))
    items = select(query, el => {
      el.classList.add(testClass)
      return el
    })
    return items.length
  }
})()
