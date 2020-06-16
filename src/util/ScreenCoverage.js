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

function isVisible (item, coverage) {
  const top = getY(item.element)
  return top >= coverage.top && top <= coverage.bottom
}

function getY (el) {
  return getOffset(el).top
}

function debounce (timeout, callback) {
  let timer = null
  return (e) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(callback, timeout)
  }
}

export function addCoverageListener (delay, items, callback) {
  document.addEventListener('scroll', debounce(delay, () => {
    const coverage = getCurrentCoverage()
    const visible = items.filter(item => isVisible(item, coverage))
    callback(visible)
  }), false)
}
