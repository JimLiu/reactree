

export const DefaultNode = {
  id: null,
  element: null,
  doesHaveChildren: false,
  expanded: false,
  visible: true,
  isRoot: false,
  refreshing: false,
  height: 24,
  depth: 0,
  needsChildrenRefresh: true,
  parentId: null,
  previousId: null,
  nextId: null,
  firstChildId: null,
  lastChildId: null,
  traits: null
}


export const DefaultOptions = {
  twistiePixels: 32,
  indentPixels: 12,
  alwaysFocused: false,
  paddingOnRow: true,
  autoExpandSingleChildren: true
}
