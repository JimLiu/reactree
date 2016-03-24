
export default class DataSource {

  getRoot(callback) {
    throw new Error('Not implemented');
  }

  getId(element) {
    throw new Error('Not implemented');
  }

  hasChildren(element) {
    throw new Error('Not implemented');
  }

  getChildren(element, callback) {
    throw new Error('Not implemented');
  }

  addChild(parent, element, afterElement, callback) {
    throw new Error('Not implemented');
  }

  removeChild(parent, element, callback) {
    throw new Error('Not implemented');
  }

}