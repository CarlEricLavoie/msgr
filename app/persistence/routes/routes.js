'use strict'

module.exports = [
  {
    prefix: '/',
    pin: 'service:persistence,cmd:*',
    map: {
      set: {
        POST: true
      }
    }
  },
  // {
  //   prefix: '/admin',
  //   pin: 'role:admin,cmd:*',
  //   map: {
  //     validate: {
  //       POST: true,
  //       alias: '/manage'
  //     }
  //   }
  // }
]
