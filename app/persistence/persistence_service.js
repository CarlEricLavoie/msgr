// require('seneca')()
//
// 	.use('conversation')
//
// 	// listen for role:math messages
// 	// IMPORTANT: must match client
// 	.listen({ pin: 'service:conversation' })

express = require('../common/express_config')('persistence', 4007);
