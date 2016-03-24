import * as ActionTypes from '../ActionTypes'

export default function node(state, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_NODE:
      return Object.assign({}, state, action.data)
    case ActionTypes.REFRESHING_CHILDREN:
      return Object.assign({}, state, {
        refreshing: action.refreshing
      })
    case ActionTypes.EXPAND_NODE:
      return Object.assign({}, state, {
        expanded: true
      })
    case ActionTypes.COLLAPSE_NODE:
      return Object.assign({}, state, {
        expanded: false
      })
    default:
      return state
  }
}
