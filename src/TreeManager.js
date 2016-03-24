import createStore from 'redux/lib/createStore'
import applyMiddleware from 'redux/lib/applyMiddleware'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import reducer from './reducers'
import * as treeActions from './actions/tree'
import TreeMonitor from './TreeMonitor'
import TreeNavigator from './TreeNavigator'

const loggerMiddleware = createLogger()

export default class TreeManager {
  constructor(dataSourse) {
    const store = createStore(reducer, applyMiddleware(thunk, loggerMiddleware))

    this.store = store
    this.monitor = new TreeMonitor(store)
    this.dataSourse = dataSourse
  }

  getDataSource() {
    return this.dataSourse
  }

  getMonitor() {
    return this.monitor
  }

  getState() {
    return this.store.getState()
  }

  getActions() {
    const manager = this
    const { dispatch } = this.store

    function bindActionCreator(actionCreator) {
      return function () {
        const action = actionCreator.apply(manager, arguments);
        if (typeof action !== 'undefined') {
          dispatch(action)
        }
      }
    }

    return Object.keys(treeActions).filter(
      key => typeof treeActions[key] === 'function'
    ).reduce((boundActions, key) => {
      boundActions[key] = bindActionCreator(treeActions[key]);
      return boundActions;
    }, {});
  }

}