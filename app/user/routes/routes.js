'use strict'

module.exports = [
	{
		prefix: '/',
		pin: 'service:user,cmd:*',
		map: {
			createUser: {
				POST: true
			},
		}
	},

];
