import React, { Component, PropTypes } from 'react'

import { DefaultOptions } from '../lib/defaults'
import DataSource from '../DataSource'
import TreeManager from '../TreeManager'
import TreeController from '../TreeController'
import TreeDragAndDrop from '../TreeDragAndDrop'
import TreeState from '../TreeState'
import TreeContainer from './TreeContainer'

export default class TreeView extends Component {


  constructor(props) {
    super(props)

    this.context = null
    this.options = {}
    this.treeState = null

    this.state = {
      visibleNodes: []
    }

    this.handleStateChange = ::this.handleStateChange
  }

  componentDidMount() {
    const { dataSource, options } = this.props
    const manager = new TreeManager(dataSource)
    const actions = manager.getActions()
    const monitor = manager.getMonitor()
    this.treeState = new TreeState(manager.getState().tree)
    monitor.subscribeToStateChange(this.handleStateChange)

    actions.init()

    this.options = Object.assign({}, DefaultOptions, options)
    this.context = {
      manager,
      actions,
      monitor,
      dataSource
    }
  }

  componentWillUnmount() {

  }

  handleStateChange(state, nextState) {
    this.treeState.state = state.tree
    this.forceUpdate()
  }

  render() {
    const { controller, dnd } = this.props
    return (
      <TreeContainer
        tree={this.treeState}
        options={this.options}
        context={this.context}
        dnd={dnd}
        controller={controller}
        {...this.state} />
    )
  }
}

TreeView.propTypes = {
  dataSource: React.PropTypes.instanceOf(DataSource).isRequired,
  controller: React.PropTypes.instanceOf(TreeController),
  dnd: React.PropTypes.instanceOf(TreeDragAndDrop),
  options: React.PropTypes.object
}

TreeView.defaultProps = {
  options: DefaultOptions,
  controller: new TreeController(),
  dnd: new TreeDragAndDrop()
}
