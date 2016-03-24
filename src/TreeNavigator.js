export default class TreeNavigator {

  static lastDescendantOf(state, nodeId) {
    if (!nodeId || !state[nodeId]) {
      return null
    }
    const node = state[nodeId]
    if (!node.visible || !node.expanded || node.lastChildId === null) {
      return node
    }
    return TreeNavigator.lastDescendantOf(state, node.lastChildId)
  }


  constructor(state, nodeId, subTreeOnly = true) {
    this.state = state
    this.node = state[nodeId]
    this.start = subTreeOnly ? this.node : null;
  }

  current() {
    return this.node || null;
  }

  next() {
    if (this.node) {
      do {
        if ((this.node.isRoot || (this.node.visible && this.node.expanded))
              && this.node.firstChildId) {
          this.node = this.state[this.node.firstChildId];
        } else if (this.node === this.start) {
          this.node = null;
        } else {
          // select next brother, next uncle, next great-uncle, etc...
          while (this.node && this.node !== this.start && !this.node.nextId) {
            this.node = this.state[this.node.parentId];
          }

          if (this.node === this.start) {
            this.node = null;
          }
          this.node = !this.node ? null : this.state[this.node.nextId];
        }
      } while (this.node && !this.node.visible);
    }
    return this.node || null;
  }

  previous() {
    if (this.node) {
      do {
        const parent = this.node.parentId ? this.state[this.node.parentId] : null
        const previous = TreeNavigator.lastDescendantOf(this.state, this.node.previousId);
        if (previous) {
          this.node = previous;
        } else if (parent && parent !== this.start
                    && parent.visible) {
          this.node = parent;
        } else {
          this.node = null;
        }
      } while (this.node && !this.node.visible);
    }
    return this.node || null;
  }


  parent() {
    if (this.node) {
      const parent = this.node.parentId ? this.state[this.node.parentId] : null
      if (parent && parent !== this.start && parent.visible) {
        this.node = parent;
      } else {
        this.node = null;
      }
    }
    return this.node || null;
  }

  first() {
    this.node = this.start
    this.next()
    return this.node || null
  }

  last() {
    if (this.start && this.start.expanded) {
      this.node = this.start.lastChildId ? this.state[this.start.lastChildId] : null

      if (this.node && !this.node.visible) {
        this.previous()
      }
    }

    return this.node || null
  }
}