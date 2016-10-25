'use strict'

module.exports = [
  {
    prefix: '/',
    pin: 'service:authentication,cmd:*',
    map: {
      verify: true,
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
