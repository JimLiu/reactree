import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

import TreeNodes from './TreeNodes'

export default class TreeContainer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      focused: false
    }

    this.onClick = ::this.onClick
    this.onTap = ::this.onTap
    this.onMouseDown = ::this.onMouseDown
    this.onMouseUp = ::this.onMouseUp
    this.onContextMenu = ::this.onContextMenu
    this.onKeyDown = ::this.onKeyDown
    this.onKeyUp = ::this.onKeyUp
  }

  onClick(event) {
    const { controller, context, tree } = this.props
    controller.onClick(context, tree, event.treeNode, event)
  }

  onTap(event) {
    const { controller, context, tree } = this.props
    controller.onTap(context, tree, event.treeNode, event)
  }

  onMouseDown(event) {
    const { controller, context, tree } = this.props
    controller.onMouseDown(context, tree, event.treeNode, event)
  }

  onMouseUp(event) {
    const { controller, context, tree } = this.props
    controller.onMouseUp(context, tree, event.treeNode, event)
  }

  onContextMenu(event) {
    const { controller, context, tree } = this.props
    controller.onContextMenu(context, tree, event.treeNode, event)
  }

  onKeyDown(event) {
    const { controller, context, tree } = this.props
    controller.onKeyDown(context, tree, event)
  }

  onKeyUp(event) {
    const { controller, context, tree } = this.props
    controller.onKeyUp(context, tree, event)
  }

  render() {
    const { options, context, tree } = this.props

    if (!tree) {
      return null
    }

    return (
      <div
        className={classNames({
          'reactree': true,
          'focused': options.alwaysFocused || this.state.focused,
          'no-row-padding': !options.paddingOnRow
        })}
        tabIndex="0"
        onClick={this.onClick}
        onTap={this.onTap}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onContextMenu={this.onContextMenu}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
      >
        <TreeNodes {...this.props} />
      </div>
    );
  }
}