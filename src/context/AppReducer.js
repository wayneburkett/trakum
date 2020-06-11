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
      const { key, data } = action.payload
      return {
        ...state,
        currentPage: { key, data }
      }
    case 'GET_PAGE_SPECS':
      return {
        ...state,
        pageSpecs: [...action.payload.pageSpecs]
      }
    case 'ADD_PAGE_SPEC':
    case 'EDIT_PAGE_SPEC':
    case 'DELETE_PAGE_SPEC':
      return {
        ...state,
        currentPage: { key: 'all', data: action.payload.pageSpec },
        pageSpecs: [...action.payload.pageSpecs]
      }
    case 'GET_CURRENT_URL':
      return {
        ...state,
        tabId: action.payload.id,
        currentUrl: action.payload.url && new URL(action.payload.url)
      }
    default:
      return state
  }
}
