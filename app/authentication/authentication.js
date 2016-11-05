var firebase = require("firebase");

firebase.initializeApp({
	serviceAccount: "../../artifacts/MGL-POC-ea1c93975476.json",
	databaseURL: "https://mgl-poc.firebaseio.com"
});

module.exports = function authentication(){
	var seneca = this;

	seneca.add({service:'authentication',cmd:'verify'}, (msg, done) => {
		firebase.auth().verifyIdToken(msg.idToken).then(function(decodedToken) {
			console.log('successfully authenticated');
			done(null, {answer: "authenticated", uid:decodedToken.uid})
		}).catch(function(error) {
			console.log(error);
			done(null, {answer: error})
		});
	});
};



