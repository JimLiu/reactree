import TreeNavigator from './TreeNavigator'

export default class TreeState {

  constructor(state) {
    this.state = state
  }

  getNavigator(id, subTreeOnly = true) {
    if (!id) {
      id = this.state.rootId
    }
    return new TreeNavigator(this.state.nodes, id, subTreeOnly)
  }

  getNode(id) {
    return id ? this.state.nodes[id] : null
  }

  getVisibleNodes() {
    const nav = this.getNavigator()

    let result = []
    let node

    while (node = nav.next()) {
      result.push(node)
    }

    return result
  }

  getNodesWithTrait(trait, includeHidden = true) {
    const idset = this.state.traitsToNodes[trait]
    let nodes = []
    if (idset) {
      idset.forEach(id => {
        const node = this.state.nodes[id]
        if (node && (node.visible || includeHidden)) {
          nodes.push(this.state.nodes[id])
        }
      })
    }
    return nodes
  }

  getNodeWithTrait(trait, includeHidden = true) {
    const nodes = this.getNodesWithTrait(trait, includeHidden)
    return nodes && nodes.length ? nodes[0] : null
  }

  getRoot() {
    return this.state.nodes[this.state.rootId]
  }

  getFocus() {
    return this.getNodeWithTrait('focused')
  }

  getHighlight() {
    return this.getNodeWithTrait('highlighted')
  }

  getSelection() {
    this.getNodesWithTrait('selected')
  }

  getNext(n, count = 1) {
    let node = n || this.getFocus() || this.getRoot()
    const nav = this.getNavigator(node.id, false)
    let nextNode
    for (let i = 0; i < count; i++) {
      nextNode = nav.next()
      if (!nextNode) {
        break
      }
      node = nextNode
    }

    return node
  }

  getPrevious(n, count = 1) {
    let node = n || this.getFocus() || this.getRoot()
    const nav = this.getNavigator(node.id, false)

    let previousNode

    for (let i = 0; i < count; i++) {
      previousNode = nav.previous()
      if (!previousNode) {
        break
      }
      node = previousNode
    }

    return node
  }

  getParent(n) {
    const node = n || this.getFocus() || this.getRoot()
    if (n.parentId == this.state.rootId) {
      return this.getRoot()
    }
    const nav = this.getNavigator(node.id, false)
    return nav.parent()
  }

  getChildren(n) {
    const node = n || this.getFocus() || this.getRoot()
    const nav = this.getNavigator(node.id)
    let result = []
    let child
    while (child = nav.next()) {
      result.push(child)
    }
    return result
  }

  getState() {
    return {
      ...this.state,
      visibleNodes: this.getVisibleNodes()
    }
  }
}