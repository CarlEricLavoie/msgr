module.exports = function user(){
	var seneca = this;
	// var authenticationService = seneca.client({ pin: 'service:authentication' }).client({pin:'service:persistence'});
	var persistenceService = seneca.client({pin : 'service:persistence', port: 4027, type: 'tcp'});


	seneca.add({service:'user',cmd:'createUser'}, (msg, reply) => {
		persistenceService.act({service:'persistence',cmd:'set',ref:"/user/{userId}", idToken:msg.cookies.idToken, data:{name:msg.name, age:msg.age}}, (reply) => {
			console.log(reply);
		});
		reply(null, {answer: "success"})
	});


	seneca.wrap({service:'user'}, function(msg, respond) {
		var body = JSON.parse(msg.args.body);
		var cookies = msg.request$.cookies;
		msg = {};
		for(var entry in body){
			msg[entry]=body[entry];
		}
		msg.cookies = cookies;
		this.prior(msg,respond);
	})
};
