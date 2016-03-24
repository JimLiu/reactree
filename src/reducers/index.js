import { default as tree } from './tree';

export default function (state = {}, action) {
  return {
    tree: tree(state.tree, action)
  };
}