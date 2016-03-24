import { DataSource } from './src'

export class NormalSource extends DataSource {
  constructor(model) {
    super()
    this.model = model
  }

  getRoot(callback) {
    callback(null, this.model)
  }

  getId(element) {
    return element.id
  }

  hasChildren(element) {
    return !!element.children
  }

  getChildren(element, callback) {
    callback(null, element.children)
  }

  addChild(parent, element, afterElement, callback) {
    if (!parent.children || !parent.children.length) {
      parent.children = [element]
      return callback(null)
    }
    let index = -1
    if (afterElement) {
      for (var i = 0; i < parent.children.length; i++) {
        if (parent.children[i].id == afterElement.id) {
          index = i
        }
      }
    }
    if (index == -1) {
      index = parent.children.length - 1
    }
    parent.children.splice(index + 1, 0, element.id)
    callback(null)
  }

  removeChild(parent, element, callback) {
    let index = -1
    for (var i = 0; i < parent.children.length; i++) {
      if (parent.children[i].id == element.id) {
        index = i
      }
    }

    if (index > -1) {
      parent.children.splice(index, 1)
    }

    callback(null)
  }
}
