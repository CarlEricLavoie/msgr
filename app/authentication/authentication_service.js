require('seneca')()
	.use('authentication')
	// listen for role:math messages
	// IMPORTANT: must match client
	.listen({ pin: 'service:authentication' })

express = require('../common/express_config')('authentication', 4005);
