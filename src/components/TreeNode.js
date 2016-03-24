import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import platform from '../lib/platform'

export default class TreeNode extends Component {
  constructor(props) {
    super(props)

    this.domNode = null

    this.state = {
      dropTarget: false
    }

    this.onClick = ::this.onClick
    this.onTap = ::this.onTap
    this.onMouseDown = ::this.onMouseDown
    this.onMouseUp = ::this.onMouseUp
    this.onContextMenu = ::this.onContextMenu
    this.onDragStart = ::this.onDragStart
    this.onDragOver = ::this.onDragOver
    this.onDragEnd = ::this.onDragEnd
    this.onDrop = ::this.onDrop
  }

  set dropTarget(val) {
    this.setState({
      dropTarget: val
    })
  }

  get dropTarget() {
    return this.state.dropTarget;
  }

  componentDidUpdate() {
  }

  onClick(event) {
    event.treeNode = this.props.node
  }

  onTap(event) {
    event.treeNode = this.props.node
  }

  onMouseDown(event) {
    event.treeNode = this.props.node
  }

  onMouseUp(event) {
    event.treeNode = this.props.node
  }

  onContextMenu(event) {
    event.treeNode = this.props.node
  }

  onDragStart(event) {
    const { node, onDragStart } = this.props
    onDragStart(node, event)
  }

  onDragOver(event) {
  }

  onDragEnd(event) {
  }

  onDrop(event) {
  }

  render() {
    const { options, node } = this.props;

    let _classNames = {
      'reactree-row': true,
      expanded: node.expanded,
      'has-children': node.doesHaveChildren,
      'drop-target': this.state.dropTarget
    };
    node.traits.forEach(t => _classNames[t] = true);

    let _styles = {
      height: node.height + 'px',
    };

    if (options.paddingOnRow) {
      _styles.paddingLeft = options.twistiePixels + ((node.depth - 1) * options.indentPixels) + 'px';
    } else {
      _styles.paddingLeft = ((node.depth - 1) * options.indentPixels) + 'px';
    }

    var nodeContent = null;
    if (node.render) {
      nodeContent = node.render();
    } else {
      nodeContent = (
        <div className="content">
          <div className="sub-content">
            <span>{node.id}</span>
          </div>
        </div>
      );
    }

    return (
      <div
        className={classNames(_classNames)}
        style={_styles}
        draggable="true"
        data-node-id={node.id}
        onClick={this.onClick}
        onTap={this.onTap}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onContextMenu={this.onContextMenu}
        onDragStart={this.onDragStart}
        onDragOver={this.onDragOver}
        onDragEnd={this.onDragEnd}
        onDrop={this.onDrop}
      >
        {nodeContent}
      </div>
    );
  }
}