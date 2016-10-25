require('seneca')()
	.use('conversation')
	.act({service: 'conversation', cmd: 'create', right: 1, left: 2}, function (err, result) {
		if (err) return console.error(err);
		console.log(result)
	});

require('seneca')()
	.client()
	.act({service: 'conversation', cmd: 'create', right: 1, left: 2}, function(e,a){
	console.log(a);
});