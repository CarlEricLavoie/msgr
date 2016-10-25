var seneca = require('seneca')();
var persistence = seneca.use('persistence');

persistence.act({service: 'persistence', cmd: 'read'}, function (err, result) {
	if (err) return console.error(err);
	console.log(result)
});