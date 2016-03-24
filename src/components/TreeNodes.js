import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import ReactDOM from 'react-dom'

import TreeNode from './TreeNode'
import DOM from '../lib/dom'


export default class TreeNodes extends Component {

  static currentExternalDragAndDropData = null

  constructor(props) {
    super(props)

    this.domNode = null
    this.wrapper = null

    this.currentDropTarget = null
    this.currentDropTargets = []
    this.shouldInvalidateDropReaction = false

    this.dragAndDropScrollInterval = null
    this.dragAndDropScrollTimeout = null
    this.dragAndDropMouseY = null
    this.currentDropPromiseTimer = null

    this.onDragStart = ::this.onDragStart
    this.onDragOver = ::this.onDragOver
    this.onDrop = ::this.onDrop
    this.onDragEnd = ::this.onDragEnd
    this.renderVisibleNodes = ::this.renderVisibleNodes
    this.getTreeNodeAround = ::this.getTreeNodeAround
    this.setupDragAndDropScrollInterval = ::this.setupDragAndDropScrollInterval
    this.cancelDragAndDropScrollInterval = ::this.cancelDragAndDropScrollInterval
    this.cancelDragAndDropScrollTimeout = ::this.cancelDragAndDropScrollTimeout
  }

  componentDidMount() {
    this.domNode = ReactDOM.findDOMNode(this)
    this.wrapper = ReactDOM.findDOMNode(this.refs.wrapper)
    window.addEventListener('dragover', this.onDragOver);
    window.addEventListener('drop', this.onDrop);
    window.addEventListener('dragend', this.onDragEnd);
    window.addEventListener('dragleave', this.onDragOver);
  }

  componentWillUnmount() {
    window.removeEventListener('dragover', this.onDragOver);
    window.removeEventListener('drop', this.onDrop);
    window.removeEventListener('dragend', this.onDragEnd);
    window.removeEventListener('dragleave', this.onDragOver);
  }

  reactionEquals(one, other) {
    if (!one && !other) {
      return true;
    } else if (!one || !other) {
      return false;
    } else if (one.accept !== other.accept) {
      return false;
    } else if (one.bubble !== other.bubble) {
      return false;
    } else if (one.effect !== other.effect) {
      return false;
    } else {
      return true;
    }
  }

  setupDragAndDropScrollInterval() {
    var viewTop = DOM.getTopLeftOffset(this.wrapper).top

    if (!this.dragAndDropScrollInterval) {
      this.dragAndDropScrollInterval = window.setInterval(() => {
        if (this.dragAndDropMouseY === undefined) {
          return
        }

        var diff = this.dragAndDropMouseY - viewTop
        var scrollDiff = 0
        var upperLimit = this.viewHeight - 35

        if (diff < 35) {
          scrollDiff = Math.max(-14, 0.2 * (diff - 35))
        } else if (diff > upperLimit) {
          scrollDiff = Math.min(14, 0.2 * (diff - upperLimit))
        }

        this.scrollTop += scrollDiff
      }, 10)

      this.cancelDragAndDropScrollTimeout()

      this.dragAndDropScrollTimeout = window.setTimeout(() => {
        this.cancelDragAndDropScrollInterval()
        this.dragAndDropScrollTimeout = null
      }, 1000)
    }

  }

  cancelDragAndDropScrollInterval() {
    if (this.dragAndDropScrollInterval) {
      window.clearInterval(this.dragAndDropScrollInterval)
      this.dragAndDropScrollInterval = null
    }

    this.cancelDragAndDropScrollTimeout()
  }

  cancelDragAndDropScrollTimeout() {
    if (this.dragAndDropScrollTimeout) {
      window.clearTimeout(this.dragAndDropScrollTimeout)
      this.dragAndDropScrollTimeout = null
    }
  }

  onDragStart(node, event) {
    const { context, tree, dnd } = this.props
    if (tree.getHighlight()) {
      return
    }

    var selection = tree.getSelection()
    var nodes

    if (selection && selection.indexOf(node) > -1) {
      nodes = selection
    } else {
      nodes = [node]
    }

    event.dataTransfer.effectAllowed = 'copyMove'

    if (event.dataTransfer.setDragImage) {
      if (nodes.length > 1) {
        var dragImage = document.createElement('div')
        dragImage.className = 'monaco-tree-drag-image'
        dragImage.textContent = '' + nodes.length
        document.body.appendChild(dragImage)
        event.dataTransfer.setDragImage(dragImage, -10, -10)
        setTimeout(() => document.body.removeChild(dragImage), 0)
      }
    }

    this.currentDragAndDropData = { sources: nodes, external: false }
    TreeNodes.currentExternalDragAndDropData = {
      sources: nodes,
      external: true,
      context,
      tree
    }

    dnd.onDragStart(context, tree, this.currentDragAndDropData, event)
  }

  onDragOver(event) {
    const { context, tree, dnd } = this.props
    const { actions } = context

    let treeNode = this.getTreeNodeAround(event.target)

    if (!treeNode) {
      // dragging outside of tree
      if (this.currentDropTarget) {
        // clear previously hovered element feedback
        this.currentDropTargets.forEach(i => i.dropTarget = false)
        this.currentDropTargets = []

        if (this.currentDropPromiseTimer) {
          clearTimeout(this.currentDropPromiseTimer)
          this.currentDropPromiseTimer = null
        }
      }

      this.cancelDragAndDropScrollInterval()
      delete this.currentDropTarget
      delete this.currentDropNode
      delete this.dragAndDropMouseY

      return false
    }

    // dragging inside the tree
    this.setupDragAndDropScrollInterval()
    this.dragAndDropMouseY = event.posy

    if (!this.currentDragAndDropData) {
      // just started dragging

      if (TreeNodes.currentExternalDragAndDropData) {
        this.currentDragAndDropData = TreeNodes.currentExternalDragAndDropData
      }
    }

    let node = treeNode.props.node
    let reaction
    // check the bubble up behavior
    do {
      reaction = dnd.onDragOver(context, tree, this.currentDragAndDropData, node, event)

      if (!reaction || reaction.bubble !== 'UP') {
        break
      }

      node = node && tree.getParent(node)
    } while (node)

    if (!node) {
      delete this.currentDropNode
      return false
    }

    var canDrop = reaction && reaction.accept

    // can drop to itself
    this.currentDragAndDropData.sources.forEach(source => {
      if (source.id == node.id) {
        canDrop = false
      }
    })

    if (canDrop) {
      this.currentDropNode = node
      event.preventDefault()
      event.dataTransfer.dropEffect = reaction.effect === 'COPY' ? 'copy' : 'move'
    } else {
      delete this.currentDropNode
    }

    // item is the model item where drop() should be called

    // can be null
    var currentDropTarget = this.refs[`node-${node.id}`]

    if (this.shouldInvalidateDropReaction
      || this.currentDropTarget !== currentDropTarget
      || !this.reactionEquals(this.currentDropNodeReaction, reaction)) {
      this.shouldInvalidateDropReaction = false

      if (this.currentDropTarget) {
        this.currentDropTargets.forEach(i => i.dropTarget = false)
        this.currentDropTargets = []

        if (this.currentDropPromiseTimer) {
          clearTimeout(this.currentDropPromiseTimer)
          this.currentDropPromiseTimer = null
        }
      }

      this.currentDropTarget = currentDropTarget
      this.currentDropNodeReaction = reaction

      if (canDrop) {
        // setup hover feedback for drop target

        if (this.currentDropTarget) {
          this.currentDropTarget.dropTarget = true;
          this.currentDropTargets.push(this.currentDropTarget)
        }

        if (reaction.bubble === 'DOWN') {
          var children = tree.getChildren(node).forEach(n => {
            let item = this.refs[`node-${n.id}`]
            if (item) {
              item.dropTarget = true
              this.currentDropTargets.push(item)
            }
          })
        }

        this.currentDropPromiseTimer = setTimeout(() => {
          if (this.currentDropNode) {
            actions.expand(this.currentDropNode)
          }
          this.shouldInvalidateDropReaction = true
        }, 500)
      }
    }

    return true;

  }

  onDrop(event) {
    const { context, tree, dnd } = this.props
    if (this.currentDropNode) {
      event.preventDefault()
      dnd.drop(context, tree, this.currentDragAndDropData, this.currentDropNode, event)
      this.onDragEnd(event)
    }
    this.cancelDragAndDropScrollInterval()
  }

  onDragEnd(event) {
    if (this.currentDropTarget) {
      this.currentDropTargets.forEach(i => i.dropTarget = false)
      this.currentDropTargets = []
    }

    if (this.currentDropPromiseTimer) {
      clearTimeout(this.currentDropPromiseTimer)
      this.currentDropPromiseTimer = null
    }

    this.cancelDragAndDropScrollInterval()
    delete this.currentDragAndDropData
    TreeNodes.currentExternalDragAndDropData = null
    delete this.currentDropNode
    delete this.currentDropTarget
    delete this.dragAndDropMouseY
  }

  getTreeNodeAround(element) {
    const { tree } = this.props
    let candidate = null
    do {
      if (element.getAttribute('data-node-id')) {
        candidate = this.refs[`node-${element.getAttribute('data-node-id')}`]
      }

      if (element === this.wrapper || element === this.domNode) {
        return candidate
      }

      if (element === document.body) {
        return null
      }

    } while (element = element.parentElement)
  }

  renderVisibleNodes() {
    const { controller, tree, options, context } = this.props

    return tree.getVisibleNodes().map((node) => {
      return (
        <TreeNode
          onDragStart={this.onDragStart}
          controller={controller}
          context={context}
          node={node}
          options={options}
          key={`node-${node.id}`}
          ref={`node-${node.id}`}
        />
      )
    })
  }

  render() {
    const { children } = this.props
    const props = { ...this.props }
    delete props.children
    return (
      <div className="reactree-scroller">
        <div ref="wrapper" className="reactree-wrapper">
          <div ref="rowsContainer" className="reactree-rows">
            { this.renderVisibleNodes() }
          </div>
        </div>
      </div>
    )
  }
}