import * as ActionTypes from '../ActionTypes'
import nodes from './nodes'

const initialState = {
  rootId: null,
  nodes: {},
  traitsToNodes: {}
}

function forEachChild(state, nodeId, fn) {
  let node = state.nodes[nodeId],
      child = state.nodes[node.firstChildId],
      next
  while (child) {
    next = state.nodes[child.nextId]
    fn(child)
    child = next
  }
}

function mapEachChild(state, nodeId, fn) {
  let result = []
  forEachChild(state, nodeId, (child) => {
    result.push(fn(child))
  })
  return result
}


function addTraits(state, action) {
  const { trait, ids } = action
  let traitsToNodes = Object.assign({}, state.traitsToNodes)
  let nodeIds = traitsToNodes[trait] || new Set();
  ids.forEach((id) => {
    if (state.nodes[id]) {
      nodeIds.add(id)
    }
  })

  traitsToNodes[trait] = nodeIds
  action.idsToAddTrait = ids
  return Object.assign({}, state, {
    traitsToNodes,
    nodes: nodes(state.nodes, action)
  })
}

function removeTraits(state, action) {
  const { trait, ids } = action
  let traitsToNodes = Object.assign({}, state.traitsToNodes)
  let nodeIds = traitsToNodes[trait] || new Set()

  // remove all if ids is empty
  if (!ids || ids.length == 0) {
    delete traitsToNodes[trait]
    action.idsToRemoveTrait = nodeIds
    return Object.assign({}, state, {
      traitsToNodes,
      nodes: nodes(state.nodes, action)
    })
  }

  ids.forEach((id) => {
    nodeIds.delete(id)
  })

  traitsToNodes[trait] = nodeIds
  action.idsToRemoveTrait = ids
  return Object.assign({}, state, {
    traitsToNodes,
    nodes: nodes(state.nodes, action)
  })
}

function hasTrait(state, trait, id) {
  return state.traitsToNodes[trait] && state.traitsToNodes[trait][id]
}

function toggleTrait(state, action) {
  const { trait, id } = action
  action.ids = [id]
  if (hasTrait(state, trait, id)) {
    return removeTraits(state, action)
  }
  return addTraits(state, action)
}

function setTraits(state, action) {
  let { trait, ids } = action
  if (!ids || ids.length == 0) {
    return removeTraits(state, action)
  }

  let traitsToNodes = Object.assign({}, state.traitsToNodes)
  let nodeIds = traitsToNodes[trait] || new Set()
  let idsToRemoveTrait = []
  nodeIds.forEach(id => {
    if (ids.indexOf(id) == -1) {
      idsToRemoveTrait.push(id)
      nodeIds.delete(id)
    }
  })

  // remove invalid node and exist ids
  ids = ids.filter((id) => state.nodes[id] && !nodeIds.has(id))
  ids.forEach((id) => {
    nodeIds.add(id)
  })

  traitsToNodes[trait] = nodeIds
  action.idsToRemoveTrait = idsToRemoveTrait
  action.idsToAddTrait = ids

  return Object.assign({}, state, {
    traitsToNodes,
    nodes: nodes(state.nodes, action)
  })
}


function init(state, root) {
  return Object.assign({}, state, {
    rootId: root.id,
    nodes: {
      [root.id]: root
    },
    traitsToNodes: {}
  })
}


export default function tree(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.INIT_TREE:
      return init(state, action.root)
    case ActionTypes.ADD_CHILD:
    case ActionTypes.REMOVE_CHILD:
    case ActionTypes.REFRESH_CHILDREN:
    case ActionTypes.UPDATE_NODE:
    case ActionTypes.REFRESHING_CHILDREN:
    case ActionTypes.EXPAND_NODE:
    case ActionTypes.COLLAPSE_NODE:
      return Object.assign({}, state, {
        nodes: nodes(state.nodes, action)
      })
    case ActionTypes.ADD_TRAITS:
      return addTraits(state, action)
    case ActionTypes.REMOVE_TRAITS:
      return removeTraits(state, action)
    case ActionTypes.SET_TRAITS:
      return setTraits(state, action)
    case ActionTypes.TOGGLE_TRAIT:
      return toggleTrait(state, action)
    default:
      return state
  }
}
