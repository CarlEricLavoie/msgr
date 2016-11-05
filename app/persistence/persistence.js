var firebase = require("firebase");

firebase.initializeApp({
	serviceAccount: "../../artifacts/MGL-POC-ea1c93975476.json",
	databaseURL: "https://mgl-poc.firebaseio.com"
});

module.exports = function persistence(){
	var seneca = this;
	var authenticationService = seneca.client({ pin: 'service:authentication', port:'4025', type:'tcp' });



	var database = firebase.database();

	seneca.add({service:'persistence',cmd:'set'}, (msg, reply) => {
		if(!msg.ref || !msg.data){
			console.warn('invalid data');
			reply(null, {answer: "invalid call to persistence::set"});
			return;
		}

		database.ref(msg.ref).set(msg.data).then(function(e){
			console.log(`successfully wrote to database`)
		},function(e){
			// console.error(Error(e))
		})
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
			reply(null, {answer: snapshot.val()});
		});
	});

	seneca.add({service:'persistence',cmd:'add'}, (msg, reply) => {
		if(!msg.ref || !msg.data){
			console.log('invalid data');
			reply(null, {answer: "invalid call to persistence::add"});
			return;
		}
		var key = database.ref(msg.ref).push().key;

		database.ref(`${msg.ref}/${key}`).set(msg.data);

		reply(null, {answer: "success", key:key})
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
		if(msg.args && msg.args.body){
			msg = JSON.parse(msg.args.body);
		}

		authenticationService.act({service:'authentication',cmd:'verify', idToken : msg.idToken},function(answer, response){


			function stringInterpolate(payload){
				for(var key in payload){
					if(typeof payload[key] === 'string'){
						payload[key] = payload[key].replace('{userId}', response.uid);
					}else if(typeof payload[key] === 'number'){

					}else if(typeof payload[key] === 'object'){
						stringInterpolate(payload[key]);
					}
				}
			}


			if(response.answer === "authenticated"){
				stringInterpolate(msg);
				prior(msg, respond);
			}else{
				respond(null, {answer : 'Authentication error'})
			}
		});
		var prior = this.prior;
	});
};
