var seneca = require('seneca')();
var client = seneca.client({pin: "service:authentication"});

module.exports = function conversation(){
	this.add('service:conversation,cmd:create', (msg, reply) => {
		// persistence.act({service: 'persistence', cmd: 'read'}, function (err, result) {
		// 	if (err) return console.error(err);
		// 	console.log(result)
		// });
		reply(null, {answer: "message created"})
	});

	this.add({service:'conversation',cmd:'getMessages'}, (msg, reply) => {
		reply(null, {answer: true})
	});

	this.wrap('service:conversation', function (msg, respond) {
		var prior = this.prior;
		//add conversation service validation
		client.act({service:'authentication',cmd:'verify', idToken : 1234},function(answer, response){
			if(response.answer === "authenticated"){
				console.log(response.answer);
				prior(msg, respond);
			}
		});
	});

};




