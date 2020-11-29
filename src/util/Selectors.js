function classList (element) {
  return Array
    .from(element.classList)
    .filter(name => name !== 'trakum-test')
}

function position (element) {
  return `:nth-of-type(${previousSiblings(element).length})`
}

// returns an array including the original element and all previous siblings with the desired tag name
function previousSiblings (element, tagName = element.tagName) {
  return (function next (element) {
    if (!element) return []
    return ((element.tagName === tagName) ? [element] : []).concat(next(element.previousElementSibling))
  })(element)
}

function selector (element, usePosition = false) {
  const tagName = element.tagName.toLowerCase()
  if (element.id) {
    return `${tagName}#${element.id}`
  } else if (classList(element) !== 0) {
    return [tagName]
      .concat(classList(element))
      .join('.')
  } else if (usePosition) {
    return tagName + position(element)
  } else {
    return tagName
  }
}

/**
 * Creates a CSS selector matching the given element
 *
 * @param element $element
 * @access public
 * @return string a CSS selector for the given element
 */
export function createSelector (element) {
  if (!element) return ''
  if (!element.parentElement) return selector(element)
  return selector(element.parentElement, true) + ' ' + selector(element)
}
