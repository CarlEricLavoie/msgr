var firebase = require("firebase");

firebase.initializeApp({
	serviceAccount: "../../artifacts/MGL-POC-ea1c93975476.json",
	databaseURL: "https://mgl-poc.firebaseio.com"
});

var uid = "some-uid";
var customToken = firebase.auth().createCustomToken(uid);


// console.log(customToken);



var authentication = require('seneca')()
	.use('authentication');

authentication.act({service: 'authentication', cmd: 'verify', idToken: customToken}, function (err, result) {
	if (err) return console.error(err);
	console.log(result)
});