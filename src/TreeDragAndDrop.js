import platform from './lib/platform'

export default class TreeDragAndDrop {

  constructor() {
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
    return {
      accept: false
    }
  }

  drop(context, tree, dragAndDropData, target, event) {
  }
}