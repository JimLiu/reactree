export default {
  ONE: {
    id: 'ONE.one'
  },

  AB: {
    id: 'AB.ROOT',
    label: 'Root',
    children: [{
      id: 'AB.a',
      label: 'a',
      children: [{
        id: 'AB.aa',
        label: 'aa'
      }, {
        id: 'AB.ab',
        label: 'ab'
      }]
    }, {
      id: 'AB.b',
      label: 'b'
    }, {
      id: 'AB.c',
      label: 'c',
      children: [{
        id: 'AB.ca',
        label: 'ca'
      }, {
        id: 'AB.cb',
        label: 'cb'
      }]
    }]
  },

  DEEP: {
    id: 'DEEP.ROOT',
    children: [{
      id: 'DEEP.a',
      children: [{
        id: 'DEEP.x',
        children: [{
          id: 'DEEP.xa'
        }, {
          id: 'DEEP.xb'
        }, ]
      }]
    }, {
      id: 'DEEP.b'
    }]
  },

  DEEP2: {
    id: 'DEEP2.ROOT',
    children: [{
      id: 'DEEP2.a',
      children: [{
        id: 'DEEP2.x',
        children: [{
          id: 'DEEP2.xa'
        }, {
          id: 'DEEP2.xb'
        }, ]
      }, {
        id: 'DEEP2.y'
      }]
    }, {
      id: 'DEEP2.b'
    }]
  }
};