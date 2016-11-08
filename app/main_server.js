'use strict'

var Express = require('Express')
var CookieParser = require('cookie-parser')
var BodyParser = require('body-parser')
var http = require('http');

function replicateFunction(body){
	switch(body.method){
		case 'post':
			return function(req, res){
				console.log(req.body);
				var postData = JSON.stringify(req.body);

				var options = {
					hostname: 'localhost',
					port: body.port,
					path: `/${body.serviceName}`,
					method: body.method,
					agent: false,
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': Buffer.byteLength(postData)
					}
				};


				console.log(`forwarding request to ${options.method} ${options.hostname}:${options.port}${options.path} :: ${postData}`);
				var request = http.request(options, (response) => {
					var responseValue;
					response.on('data', (chunk) => {
						responseValue = chunk;
					});
					response.on('end', () => {
						res.send(responseValue);
						console.log('No more data in response.');
					});
				});

				request.on('error', (e) => {
					console.log(`problem with request: ${e.message}`);
				});

				request.write(postData);
				request.end();
			}
		break;
		case 'get':
			return function(req, res){
				http.get({
					hostname: 'localhost',
					port: body.port,
					path: `/${body.serviceName}`,
					agent: false  // create a new agent just for this one request
				}, (res) => {
					// Do stuff with response
				});
			}
	}
}


module.exports = {
	app : (function(){
		const cors = require('cors');

		// Prep express
		var app = Express();
		app.use(cors());
		app.use(CookieParser())
		app.use(BodyParser.urlencoded({extended: true}))
		app.use(BodyParser.json())
		http.Server(app);
		// var io = require("socket.io")(http);

		var config = {
			context: app
		};

		app.listen(3000, function(){
			console.log('Example app listening on port 3000!');
		});

		app.post('/service', function(req, res){
			var body = req.body;
			app[body.method]('/'+body.serviceName, replicateFunction(body))
			res.send('Hello World!');
		});

		return app;
	})()





}


