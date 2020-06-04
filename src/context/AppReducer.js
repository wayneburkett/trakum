/**
 * A reducer
 *
 * @param {object} state the previous state
 * @param {{type: string, payload: object}} action
 * @returns {} the new state
 */
export default (state, action) => {
  switch (action.type) {
    case 'SELECT_KEY':
      return {
        ...state,
        selectedKey: action.payload
      }
    case 'ADD_PAGE_SPEC':
      return {
        ...state,
        pageSpecs: [action.payload, ...state.pageSpecs]
      }
    default:
      return state
  }
}

