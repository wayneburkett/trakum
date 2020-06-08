/**
 * A reducer
 *
 * @param {object} state the previous state
 * @param {{type: string, payload: object}} action
 * @returns {} the new state
 */
export default (state, action) => {
  console.log(action)
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
        pageSpecs: [...action.payload]
      }
    case 'ADD_PAGE_SPEC':
      return {
        ...state,
        currentPage: { key: 'all', data: action.payload },
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
