import { TreeDragAndDrop } from './src'

export default class DemoDragAndDrop extends TreeDragAndDrop {

  constructor() {
    super()
    this.currentDragOver = null
  }

  onDragStart(context, tree, dragAndDropData, event) {
    const { actions } = context
    const { sources } = dragAndDropData
    let source = null
    if (sources.length) {
      source = sources[0]
    }

    if (source.expanded) {
      actions.collapse(source)
    }
  }

  onDragOver(context, tree, dragAndDropData, target, event) {
    let reaction = {
      accept: false
    }

    if (!target) {
      return reaction
    }

    const isCopy = (event.ctrlKey && !platform.isMacintosh) || (event.altKey && platform.isMacintosh)

    if (target.doesHaveChildren) {
      reaction.accept = true
      reaction.bubble = 'DOWN'
    } else {
      reaction.accept = true
      reaction.bubble = 'UP'
    }

    if (isCopy) {
      reaction.effect = 'COPY'
    }

    return reaction
  }

  drop(context, tree, dragAndDropData, target, event) {
    const { actions } = context
    const { external, sources } = dragAndDropData
    const sourceTree = external ? dragAndDropData.tree : tree
    const sourceActions = external ? dragAndDropData.context.actions : actions
    const isCopy = (event.ctrlKey && !platform.isMacintosh) || (event.altKey && platform.isMacintosh)
    let source = null
    if (sources.length) {
      source = sources[0]
    }
    if (!isCopy) {
      const parent = sourceTree.getParent(source)
      sourceActions.removeChild(parent, source)
    } else {

    }
    actions.addChild(target, source, null)
  }
}