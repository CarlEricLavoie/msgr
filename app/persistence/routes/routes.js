'use strict'

module.exports = [
  {
    prefix: '/',
    pin: 'service:persistence,cmd:*',
    map: {
      set: {
        POST: true
      },
      get: {
        GET : true
      }
    }
  },

];
