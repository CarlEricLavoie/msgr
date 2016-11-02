'use strict'

var Seneca = require('seneca')
var Express = require('Express')
var Web = require('./web')




module.exports = (service, port) => {
	var Routes = require(`../${service}/routes/routes`)
	var Plugin = require(`../${service}/${service}`)

	var config = {
		routes: Routes,
		adapter: require('seneca-web-adapter-express'),
		context: Express()
	}

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
}


