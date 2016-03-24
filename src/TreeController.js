import platform from './lib/platform'

export default class TreeController {

  onClick(context, tree, node, event) {
    // A Ctrl click on the Mac is a context menu event
    if (platform.isMacintosh && event.ctrlKey) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    if (event.middleButton) {
      return false // Give contents of the item a chance to handle this (e.g. open link in new tab)
    }

    if (event.target && event.target.tagName
      && event.target.tagName.toLowerCase() === 'input') {
      return false // Ignore event if target is a form input field (avoids browser specific issues)
    }

    return this.onLeftClick(context, tree, node, event, 'mouse');
  }

  onMouseDown(context, tree, node, event) {

  }

  onMouseUp(context, tree, node, event) {

  }

  onTap(context, tree, node, event) {
    var target = event.initialTarget

    if (target && target.tagName
      && target.tagName.toLowerCase() === 'input') {
      return false // Ignore event if target is a form input field (avoids browser specific issues)
    }

    return this.onLeftClick(context, tree, node, event, 'mouse')
  }

  onLeftClick(context, tree, node, event, origin = 'mouse') {
    if (!node) {
      return
    }

    const { actions } = context

    actions.setSelection(node.id)
    actions.setFocus(node.id)

    if (node.expanded) {
      actions.collapse(node)
    } else {
      actions.expand(node)
    }
  }

  onContextMenu(context, tree, node, event) {

  }

  onKeyDown(context, tree, event) {
    switch(event.keyCode) {
      case 27: // esc
        this.onEscape(context, tree, event);
        break;
      case 32: // space
        this.onSpace(context, tree, event);
        break;
      case 37: // left
        this.onLeft(context, tree, event);
        break;
      case 38: // up
        this.onUp(context, tree, event);
        break;
      case 39: // right
        this.onRight(context, tree, event);
        break;
      case 40: // down
        this.onDown(context, tree, event);
        break;
    }
  }

  onKeyUp(context, tree, event) {
    switch(event.keyCode) {
      case 13: // enter
        this.onEnter(context, tree, event);
        break;
    }
  }

  onUp(context, tree, event) {
    const { actions } = context

    if (tree.getHighlight()) {
      actions.clearHighlight()
    } else {
      const previous = tree.getPrevious()
      if (previous) {
        actions.setFocus(previous.id)
      }
    }
    return true;
  }

  onDown(context, tree, event) {
    const { actions } = context

    if (tree.getHighlight()) {
      actions.clearHighlight()
    } else {
      const next = tree.getNext()
      if (next) {
        actions.setFocus(next.id)
      }
    }
    return true;
  }

  onLeft(context, tree, event) {
    const { actions } = context

    if (tree.getHighlight()) {
      actions.clearHighlight()
    } else {
      const focus = tree.getFocus()
      if (focus) {
        if (focus.expanded) {
          actions.collapse(focus)
        } else {
          const parent = tree.getParent()
          if (parent) {
            actions.setFocus(parent.id)
          }
        }
      }
    }
    return true;
  }

  onRight(context, tree, event) {
    const { actions } = context

    if (tree.getHighlight()) {
      actions.clearHighlight()
    } else {
      const focus = tree.getFocus()
      if (focus) {
        if (!focus.expanded) {
          actions.expand(focus)
        }
      }
    }
    return true;
  }

  onEnter(context, tree, event) {
    const { actions } = context

    if (tree.getHighlight()) {
      return false
    }

    const focus = tree.getFocus()
    if (focus) {
      actions.setSelection(focus.id)
    }
    return true;
  }

  onSpace(context, tree, event) {
    const { actions } = context

    if (tree.getHighlight()) {
      return false
    }

    const focus = tree.getFocus()
    if (focus) {
      if (focus.expanded) {
        actions.collapse(focus)
      } else {
        actions.expand(focus)
      }
    }
    return true
  }

  onEscape(context, tree, event) {
    const { actions } = context

    if (tree.getHighlight()) {
      actions.clearHighlight()
      return true
    }

    if (tree.getFocus() || tree.getSelection().length) {
      actions.clearFocus()
      actions.clearSelection()
      return true
    }

    return false
  }

}