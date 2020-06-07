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
    case 'GET_PAGE_SPECS':
      return {
        ...state,
        pageSpecs: [...action.payload]
      }
    case 'ADD_PAGE_SPEC':
      return {
        ...state,
        selectedKey: 'all',
        pageSpecs: [action.payload, ...state.pageSpecs]
      }
    case 'GET_CURRENT_URL':
      return {
        ...state,
        tabId: action.payload.id,
        currentUrl: new URL(action.payload.url)
      }
    default:
      return state
  }
}
