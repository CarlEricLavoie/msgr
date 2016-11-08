module.exports = function user(){
	var seneca = this;
	// var authenticationService = seneca.client({ pin: 'service:authentication' }).client({pin:'service:persistence'});
	var persistenceService = seneca.client({pin : 'service:persistence', port: 4027, type: 'tcp'});


	seneca.add({service:'user',cmd:'createUser'}, (msg, reply) => {
		persistenceService.act({service:'persistence',cmd:'get',ref:"/user/{userId}", idToken:msg.idToken}, (err, result) => {
 			if(!result.answer){
				persistenceService.act({service:'persistence',cmd:'set',ref:"/user/{userId}", idToken:msg.idToken, data:{name:msg.name, age:msg.age, photo: msg.photo}}, (reply) => {
				});
			}
		});

		reply(null, {answer: "success"})
	});


	seneca.wrap({service:'user'}, function(msg, respond) {
		var body = {};
		if(msg.args && msg.args.body){
			body = JSON.parse(msg.args.body);
		}

		console.log(body);


		msgObj = {};
		for(var entry in body){
			msgObj[entry]=body[entry];
		}
		for(var entry in msg.args.query){
			msgObj[entry]=msg.args.query[entry];
		}
		// msg.cookies = cookies;
		this.prior(msgObj,respond);
	})
};
