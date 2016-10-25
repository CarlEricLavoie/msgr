var firebase = require("firebase");
var http = require('http');

firebase.initializeApp({
	serviceAccount: "../../artifacts/MGL-POC-ea1c93975476.json",
	databaseURL: "https://mgl-poc.firebaseio.com"
});

module.exports = function persistence(options){
	this.add({service:'persistence',cmd:'save'}, (msg, reply) => {
		console.log(msg.uid);
		//save to firebase
		reply(null, {answer: "success"})
	});

	this.add({service:'persistence', cmd:'read'}, (msg, reply) =>{
		if(!msg.uid) return;
		firebase.auth().verifyIdToken(msg.uid).then(function(decodedToken) {
			var uid = decodedToken.uid;
			// ...
		}).catch(function(error) {
			console.log('invalid UID');
			// Handle error
		});
		console.log();
		reply(null, {answer: 'success'})
	});
};
