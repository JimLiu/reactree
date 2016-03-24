import * as ActionTypes from '../ActionTypes'
import node from './node'



function forEachChild(state, nodeId, fn) {
  let node = state[nodeId],
      child = state[node.firstChildId],
      next
  while (child) {
    next = state[child.nextId]
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

function removeNode(state, nodeId) {
  let node = state[nodeId]
  if (node) {
    while (node.firstChildId !== null) {
      state = removeChild(state, nodeId, node.firstChildId)
      node = state[nodeId]
    }
    return removeChild(state, node.parentId, node.id)
  }
  return state
}

function addChild(state, parentId, node, afterNodeId) {
  // remove it if it exists before add it
  state = removeNode(state, node.id)
  node = Object.assign({}, node)
  const nodeId = node.id
  const parent = state[parentId]
  //afterNodeId = afterNodeId || parent.lastChildId
  let afterNode = afterNodeId ? state[afterNodeId] : null
  let updates = {}

  const isEmpty = parent.firstChildId === null
  const atHead = afterNodeId === null
  const atTail = afterNodeId === parent.lastChildId || !afterNode

  if (isEmpty) {
    node.nextId = null
    node.previousId = null
    updates = {
      [parentId]: Object.assign({}, parent, {
        firstChildId: node.id,
        lastChildId: node.id
      })
    }
  } else if (atHead) {
    node.nextId = parent.firstChildId
    node.previousId = null
    updates = {
      [parentId]: Object.assign({}, parent, {
        firstChildId: node.id
      }),
      [parent.firstChildId]: Object.assign({}, state[parent.firstChildId], {
        previousId: node.id
      })
    }
  } else if (atTail) {
    node.nextId = null
    node.previousId = parent.lastChildId
    updates = {
      [parentId]: Object.assign({}, parent, {
        lastChildId: node.id
      }),
      [parent.lastChildId]: Object.assign({}, state[parent.lastChildId], {
        nextId: node.id
      })
    }
  } else {
    node.previousId = afterNode.id
    node.nextId = afterNode.nextId
    updates = {
      [afterNode.nextId]: Object.assign({}, state[afterNode.nextId], {
        previousId: node.id
      }),
      [afterNode.id]: Object.assign({}, state[afterNode.id], {
        nextId: node.id
      })
    }
  }

  node.parentId = parentId
  node.depth = parent.depth + 1
  updates[nodeId] = node

  return Object.assign({}, state, updates)
}

function removeChild(state, parentId, nodeId) {
  state = Object.assign({}, state)
  let parent = state[parentId]
  let node = state[nodeId]
  let updates = {}
  const isFirstChild = parent.firstChildId == node.id
  const isLastChild = parent.lastChildId == node.id

  if (isFirstChild && isLastChild) {
    updates = {
      [parentId]: Object.assign({}, parent, {
        firstChildId: null,
        lastChildId: null
      })
    }
  } else if (isFirstChild) {
    updates = {
      [node.nextId]: Object.assign({}, state[node.nextId], {
        previousId: null
      }),
      [parentId]: Object.assign({}, parent, {
        firstChildId: node.nextId
      })
    }
  } else if (isLastChild) {
    updates = {
      [node.previousId]: Object.assign({}, state[node.previousId], {
        nextId: null
      }),
      [parentId]: Object.assign({}, parent, {
        lastChildId: node.previousId
      })
    }
  } else {
    updates = {
      [node.nextId]: Object.assign({}, state[node.nextId], {
        previousId: node.previousId
      }),
      [node.previousId]: Object.assign({}, state[node.previousId], {
        nextId: node.nextId
      })
    }
  }

  delete state[nodeId]

  return Object.assign({}, state, updates)
}

function refreshChildren(state, nodeId, children, recursive) {
  let node = Object.assign({}, state[nodeId])
  node.needsChildrenRefresh = false
  node.refreshing = false
  state = Object.assign({}, state, {
    [nodeId]: node
  })

  let staleNodes = {}
  while (node.firstChildId !== null) {
    staleNodes[node.firstChildId] = state[node.firstChildId]
    state = removeChild(state, nodeId, node.firstChildId)
    node = state[nodeId]
  }

  children.forEach((child, i) => {
    const id = child.id
    var item = staleNodes[id] || child
    if (recursive) {
      item.needsChildrenRefresh = true;
    }
    delete staleNodes[id]
    state = addChild(state, nodeId, item, node.lastChildId)
  })

  for (let staleNodeId in staleNodes) {
    delete state[staleNodeId]
  }

  return state
}


function addOrRemoveTraits(state, action) {
  const { trait, idsToRemoveTrait, idsToAddTrait } = action
  let updates = {}

  if (idsToRemoveTrait) {
    idsToRemoveTrait.forEach((id) => {
      let node = state[id]
      if (node) {
        node = Object.assign({}, node)
        node.traits.delete(trait)
        updates[id] = node
      }
    })
  }

  if (idsToAddTrait) {
    idsToAddTrait.forEach((id) => {
      let node = state[id]
      if (node) {
        node = Object.assign({}, node)
        node.traits.add(trait)
        updates[id] = node
      }
    })
  }

  return Object.assign({}, state, updates)
}


export default function nodes(state, action) {
  const nodeId = action.nodeId
  switch (action.type) {
    case ActionTypes.ADD_CHILD:
      return addChild(state, action.parentId, action.node, action.afterId)
    case ActionTypes.REMOVE_CHILD:
      return removeChild(state, action.parentId, action.nodeId)
    case ActionTypes.REFRESH_CHILDREN:
      return refreshChildren(state, nodeId, action.children, action.recursive)
    case ActionTypes.UPDATE_NODE:
    case ActionTypes.REFRESHING_CHILDREN:
    case ActionTypes.EXPAND_NODE:
    case ActionTypes.COLLAPSE_NODE:
      if (!nodeId || !state[nodeId])
        return state
      return Object.assign({}, state, {
        [nodeId]: node(state[nodeId], action)
      })
    case ActionTypes.ADD_TRAITS:
    case ActionTypes.REMOVE_TRAITS:
    case ActionTypes.SET_TRAITS:
      return addOrRemoveTraits(state, action)
    default:
      return state
  }
}
