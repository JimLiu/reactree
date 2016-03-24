import * as ActionTypes from '../ActionTypes'
import { DefaultNode } from '../lib/defaults'

function createNode(dataSource, element) {
  return Object.assign({}, DefaultNode, {
    id: dataSource.getId(element),
    element: element,
    doesHaveChildren: dataSource.hasChildren(element),
    traits: new Set()
  })
}

function doRefreshChildren(node, recursive = false, force = false) {
  const dataSource = this.getDataSource()
  if (!force && !node.expanded) {
    return {
      type: ActionTypes.UPDATE_NODE,
      nodeId: node.id,
      data: {
        needsChildrenRefresh: true
      }
    }
  }

  return dispatch => {
    dispatch({
      type: ActionTypes.REFRESHING_CHILDREN,
      nodeId: node.id,
      refreshing: true
    })

    dataSource.getChildren(node.element, (err, elements) => {
      if (err) {
        return dispatch({
          type: ActionTypes.REFRESHING_CHILDREN,
          nodeId: node.id,
          refreshing: false
        })
      }
      elements = !elements ? [] : elements.slice(0)

      const children = elements.map((element) => createNode(dataSource, element))

      dispatch({
        type: ActionTypes.REFRESH_CHILDREN,
        nodeId: node.id,
        children,
        recursive
      })

      if (recursive) {
        children.forEach(child => {
          dispatch(doRefreshChildren.apply(this, [child, true, true]))
        })
      }

    })
  }
}

function addTraits(trait, ids) {
  return {
    type: ActionTypes.ADD_TRAITS,
    trait,
    ids
  }
}

function removeTraits(trait, ids) {
  return {
    type: ActionTypes.REMOVE_TRAITS,
    trait,
    ids
  }
}

function toggleTrait(trait, id) {
  return {
    type: ActionTypes.TOGGLE_TRAIT,
    trait,
    id
  }
}

function setTraits(trait, ids) {
  return {
    type: ActionTypes.SET_TRAITS,
    trait,
    ids
  }
}

export function init() {
  const dataSource = this.getDataSource()
  return dispatch => {
    dataSource.getRoot((err, model) => {
      if (err) {
        return dispatch({
          type: ActionTypes.DATASOURCE_ERROR,
          method: 'getRoot',
          err
        })
      }

      const root = createNode(dataSource, model)
      root.expanded = true
      root.visible = false
      root.isRoot = true

      dispatch({
        type: ActionTypes.INIT_TREE,
        root
      })
      // refresh root node
      dispatch(doRefreshChildren.apply(this, [root, true]))
    })
  }
}

export function expand(node) {

  return dispatch => {
    if (node.needsChildrenRefresh) {
      dispatch(doRefreshChildren.apply(this, [node, true, true]))
    }

    dispatch({
      type: ActionTypes.EXPAND_NODE,
      nodeId: node.id
    })
  }
}

export function collapse(node, recursive = false) {
  return {
    type: ActionTypes.COLLAPSE_NODE,
    nodeId: node.id,
    recursive
  }
}

export function refreshChildren(node, recursive = false, force = false) {
  return dispatch => {
    dispatch(doRefreshChildren.apply(this, [node, recursive, force]))
  }
}

export function clearHighlight() {
  return dispatch => {
    dispatch(setTraits.apply(this, ['highlighted', null]))
  }
}

export function setHighlight(id) {
  return dispatch => {
    dispatch(setTraits.apply(this, ['highlighted', [id]]))
  }
}

export function clearSelection() {
  return dispatch => {
    dispatch(setTraits.apply(this, ['selected', null]))
  }
}

export function setSelection(id) {
  return dispatch => {
    dispatch(setTraits.apply(this, ['selected', [id]]))
  }
}

export function clearFocus() {
  return dispatch => {
    dispatch(setTraits.apply(this, ['focused', null]))
  }
}

export function setFocus(id) {
  return dispatch => {
    dispatch(setTraits.apply(this, ['focused', [id]]))
  }
}

export function select(id) {
  return dispatch => {
    dispatch(addTraits.apply(this, ['selected', [id]]))
  }
}

export function selectAll(ids) {
  return dispatch => {
    dispatch(addTraits.apply(this, ['selected', ids]))
  }
}

export function deselectAll(ids) {
  return dispatch => {
    dispatch(removeTraits.apply(this, ['selected', ids]))
  }
}

export function deselect(id) {
  return dispatch => {
    dispatch(removeTraits.apply(this, ['selected', [id]]))
  }
}

export function addChild(parent, child, afterNode) {
  const dataSource = this.getDataSource()
  const node = createNode(dataSource, child.element)
  const afterElement = afterNode ? afterNode.element : null
  return dispatch => {
    dataSource.addChild(parent.element, child.element, afterElement, (err) => {
      if (err) {
        return dispatch({
          type: ActionTypes.DATASOURCE_ERROR,
          method: 'addChild',
          err
        })
      }
      dispatch({
        type: ActionTypes.ADD_CHILD,
        parentId: parent.id,
        afterId: afterNode ? afterNode.id : null,
        node
      })
      dispatch(doRefreshChildren.apply(this, [node, true, true]))
    })
  }
}

export function removeChild(parent, child) {
  const dataSource = this.getDataSource()
  return dispatch => {
    dataSource.removeChild(parent.element, child.element, (err) => {
      if (err) {
        return dispatch({
          type: ActionTypes.DATASOURCE_ERROR,
          method: 'removeChild',
          err
        })
      }
      dispatch({
        type: ActionTypes.REMOVE_CHILD,
        parentId: parent.id,
        nodeId: child.id
      })
    })
  }
}
