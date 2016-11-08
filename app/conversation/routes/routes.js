'use strict'

module.exports = [
  {
    prefix: '/',
    pin: 'service:conversation,cmd:*',
    map: {
      sendMessage: {
        POST : true
      },
      createConversation : {
        POST : true
      },
      getConversations : {
        GET : true
      },
      getConversation : {
        GET : true
      },
      addUser : {
        POST : true
      },
      getUsers : {
        GET : true
      },
      getMessages : {
        GET : true
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
