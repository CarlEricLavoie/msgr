'use strict'

var Seneca = require('seneca')
var Express = require('Express')
var Web = require('./web')
var CookieParser = require('cookie-parser')
var BodyParser = require('body-parser')



module.exports = (service, port) => {
	var Routes = require(`../${service}/routes/routes`);
	var Plugin = require(`../${service}/${service}`);
	const cors = require('cors');

	// Prep express
	var app = Express();
	app.use(cors());
	app.use(CookieParser())
	app.use(BodyParser.urlencoded({extended: true}))
	var http = require('http').Server(app);
	// var io = require("socket.io")(http);

	var config = {
		routes: Routes,
		adapter: require('seneca-web-adapter-express'),
		context: app
	};

	// io.on('connection', function(socket){
	// 	console.log('a user connected');
	// });


	var seneca = Seneca();

	//Custom code to handle global errors
	// (function(seneca, add){
	// 	seneca.add = function(obj, func){
	// 		var originalFunction = arguments[1];
	// 		// console.log(typeof arguments[1] === "function");
	// 		console.log ( obj );
	// 		arguments[1]= function(){
	// 			try{
	// 				originalFunction.apply(this, arguments)
	// 			}catch(e){
	// 				arguments[1](null, {answer: 'something went wrong.'});
	// 				console.error(e);
	// 			}
	// 		};
	//
	// 		add.apply(this, arguments);
	// 	}
	// })(seneca, seneca.add)

	seneca
		.use(Plugin)
		.use(Web, config)
		.ready(() => {

			var server = seneca.export('web/context')()
			server.listen(port || 3000, () => {
				console.log(`server started on: ${port}`)
			})
		})

	seneca.use(Plugin)
		.listen({port:20+port, type:'tcp'})

	subscribeServices(Routes, port);
}

function subscribeServices(routes, port){

	for(var route of routes){
		// console.log(route);
		for(var endpoint in route.map){
			for(var method in route.map[endpoint]){
				subscribeService(endpoint, method, port, "/test")
			}
		}
	}
}

var http = require('http');
function subscribeService(serviceName, method, port, prefix){



	var postData = require('querystring').stringify({
		serviceName,
		method : method.toLowerCase(),
		port,
		prefix
	});

	var options = {
		hostname: 'localhost',
		port: 3000,
		path: '/service',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(postData)
		}
	};


	var req = http.request(options, (res) => {
	});

	req.on('error', (e) => {
		console.log(`problem with request: ${e.message}`);
	});

	console.log(`subscribing server ${postData}`);
	req.write(postData);
	req.end();

}


