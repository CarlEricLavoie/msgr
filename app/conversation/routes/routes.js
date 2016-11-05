'use strict'

module.exports = [
  {
    prefix: '/',
    pin: 'service:conversation,cmd:*',
    map: {
      message: {
        DELETE : true
      },
      createConversation : {
        POST : true
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
