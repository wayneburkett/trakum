function classList (element) {
  return Array
    .from(element.classList)
    .filter(name => name !== 'trakum_test')
}

// TODO: this returns nth-child, but previousSiblings returns what is better used for nth-of-type
// need to decide which is preferred, because right now this is a bug
function position (element) {
  return `:nth-child(${previousSiblings(element).length})`
}

// returns an array including the original element and all previous siblings with the desired tag name
function previousSiblings (element, tagName = element.tagName) {
  return (function next (element) {
    if (!element) return []
    return ((element.tagName === tagName) ? [element] : []).concat(next(element.previousElementSibling))
  })(element)
}

/**
 * Creates a CSS selector matching the given element
 *
 * @param element $element
 * @param usePosition = false if true, then fallback to positional selectors for elements with no class names
 * @access public
 * @return string a CSS selector for the given element
 */
export function createSelector (element, usePosition = false) {
  const tagName = element.tagName.toLowerCase()
  if (element.classList.length !== 0) {
    return [tagName]
      .concat(classList(element))
      .join('.')
  } else if (usePosition) {
    return tagName + position(element)
  } else {
    return tagName
  }
}
