module.exports = function persistence(){
	var seneca = this;
	var authenticationService = seneca.client({ pin: 'service:authentication' });

	var firebase = require("firebase");

	firebase.initializeApp({
		serviceAccount: "../../artifacts/MGL-POC-ea1c93975476.json",
		databaseURL: "https://mgl-poc.firebaseio.com"
	});

	var database = firebase.database();

	seneca.add({service:'persistence',cmd:'set'}, (msg, reply) => {
		if(!msg.ref || !msg.data){
			console.log('invalid data');
			reply(null, {answer: "invalid call to persistence::set"});
			return;
		}

		database.ref(msg.ref).set(msg.data);
		//save to firebase
		reply(null, {answer: "success"})
	});

	seneca.add({service:'persistence',cmd:'get'}, (msg, reply) => {
		if(!msg.ref){
			console.log('invalid data');
			reply(null, {answer: "invalid call to persistence::get"});
			return;
		}
		database.ref(msg.ref).once('value').then(function(snapshot) {
			reply(null, {answer: snapshot});
		});
	});

	seneca.add({service:'persistence',cmd:'add'}, (msg, reply) => {
		if(!msg.ref || !msg.data){
			console.log('invalid data');
			reply(null, {answer: "invalid call to persistence::set"});
			return;
		}

		var key = database.ref(msg.ref).push().key;
		database.ref(`${msg.ref}/${key}`).set(data);

		reply(null, {answer: "success"})
	});

	seneca.add({service:'persistence',cmd:'delete'}, (msg, reply) => {
		if(!msg.ref){
			console.log('invalid data');
			reply(null, {answer: "invalid call to persistence::delete"});
			return;
		}

		database.ref(msg.ref).delete().then(function(){
			reply(null, {answer: 'success'});
		})
	});

	seneca.wrap({service:'persistence'}, function (msg, respond) {
		//add conversation service validation

		// console.log(msg.args.body);
		var body = JSON.parse(msg.args.body);
		authenticationService.act({service:'authentication',cmd:'verify', idToken : body.idToken},function(answer, response){
			// if(response.answer === "authenticated"){
			if(true){
				console.log(response.answer);
				prior(body, respond);
			}else{
				respond(null, {answer : 'Authentication error'})
			}
		});
		var prior = this.prior;
	});
};
