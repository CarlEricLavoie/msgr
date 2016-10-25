require('seneca')()
	.use('persistence')
	.listen({ type: 'http', pin: 'service:persistence' });