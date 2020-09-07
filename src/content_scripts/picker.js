import { createSelector } from '../util/Selectors'

const $ = require('jquery')

const makeSelector = (function () {
  const testClassName = 'trakum-test'
  const selectedClassName = 'trakum-test-selected'

  let isSelected = false
  let currentSelector = null

  function clearClass (className) {
    $(`.${className}`).removeClass(className)
  }

  function onMouseOver (event) {
    if (isSelected) return false
    clearClass(testClassName)
    currentSelector = createSelector(event.target)
    $(currentSelector).addClass(testClassName)
  }

  function onMouseOut (event) {
    if (isSelected) return false
    $(this).removeClass(testClassName)
  }

  function onClick (event) {
    event.preventDefault()
    if (!isSelected && currentSelector !== null) {
      clearClass(testClassName)
      $(currentSelector).addClass(selectedClassName)
      isSelected = true
    } else {
      isSelected = false
      clearClass(selectedClassName)
    }
  }

  return function () {
    $('body')
      .mouseover(onMouseOver)
      .mouseout(onMouseOut)
      .click(onClick)
  }
})()

export const inject = () => makeSelector()
