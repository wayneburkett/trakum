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
      return {
        ...state,
        selectedKey: action.payload
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
        currentUrl: action.payload
      }
    default:
      return state
  }
}
