module.exports = function user(){
	var seneca = this;
	// var authenticationService = seneca.client({ pin: 'service:authentication' }).client({pin:'service:persistence'});
	var persistenceService = seneca.client({pin : 'service:persistence', port: 4027, type: 'tcp'});


	seneca.add({service:'user',cmd:'createUser'}, (msg, reply) => {
		var body = JSON.parse(msg.args.body);
		if(!body.data){
			console.warn('invalid data');
			reply(null, {answer: "invalid call to user::createUser"});
			return;
		}

		persistenceService.act({service:'persistence',cmd:'set',ref:"/user/{userId}", idToken:body.idToken, data:body.data}, (reply) => {
			console.log(reply);
		});
		reply(null, {answer: "success"})
	});



	// seneca.wrap({service:'user'}, function (msg, respond) {
	// 	//add conversation service validation
	//
	// 	var body = JSON.parse(msg.args.body);
	// 	authenticationService.act({service:'authentication',cmd:'verify', idToken : body.idToken},function(answer, response){
	// 		if(response.answer === "authenticated"){
	// 		// if(true){
	// 			console.log(response.answer);
	// 			prior(body, respond);
	// 		}else{
	// 			respond(null, {answer : 'Authentication error'})
	// 		}
	// 	});
	// 	var prior = this.prior;
	// });
};
