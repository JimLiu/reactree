
export default class TreeMonitor {

  constructor(store) {
    this.store = store
  }

  subscribeToStateChange(listener, getState) {
    if (!getState) {
      getState = ::this.store.getState
    }

    let prevState = getState()
    //console.log('prevState', prevState)
    const handleChange = () => {
      const state = getState()
      //console.log('nextState', state)
      if (state === prevState) {
        return
      }
      try {
        listener(state, prevState)
      } finally {
        prevState = state
      }
    }
    return this.store.subscribe(handleChange)
  }

  subscribeToTreeStateChange(listener) {
    return this.subscribeToStateChange(listener, () => this.store.getState().tree)
  }
}