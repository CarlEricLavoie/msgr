module.exports = function conversation() {
	seneca = this;
	var persistenceService = seneca.client({pin: 'service:persistence', port: 4027, type: 'tcp'});

	seneca.add({service: 'conversation', cmd: 'createConversation'}, (msg, reply) => {

		persistenceService.act(
			{
				service: 'persistence',
				cmd: 'add',
				ref: '/conversation',
				idToken: msg.cookies.idToken,
				data: {
					admin: '{userId}',
					name: msg.name
				}
			}, (reply, response) => {
				persistenceService.act({
					service: 'persistence',
					cmd: 'set',
					ref: `/user/{userId}/conversations/${response.key}`,
					idToken: msg.cookies.idToken,
					data: true
				});
			});
		reply(null, {answer: "conversation created"})
	});

	seneca.add({service: 'conversation', cmd: 'getConversations'}, (msg, reply) => {
		var convos = [];
		persistenceService.act(
			{
				service: 'persistence',
				cmd: 'get',
				ref: `/user/{userId}/conversations/`,
				idToken: msg.cookies.idToken
			}, (err, result) => {

				var itemsLength = Object.keys(result.answer).length;
				function replyHandler(err, result){
					convos.push(result.answer);
					if(convos.length >= itemsLength){
						reply(null, convos);
					}
				}

				for(convo in result.answer){
					persistenceService.act({
						service: 'persistence',
						cmd: 'get',
						ref: `/conversation/${convo}`,
						idToken: msg.cookies.idToken
					}, replyHandler)
				}
			});
	});

	seneca.add({service: 'conversation', cmd: 'getMessages'}, (msg, reply) => {
		reply(null, {answer: true})
	});

	seneca.add({service: 'conversation', cmd: 'sendMessage'}, (msg, reply) => {
		persistenceService.act(
			{
				service: 'persistence',
				cmd: 'add',
				ref: `/conversation/${msg.conversationId}/messages`,
				idToken: msg.cookies.idToken,
				data: {
					msg: `${msg.msg}`,
					timestamp: `${Date.now()}`
				}
			});
		reply(null, {answer: "success"})
	});




	seneca.wrap({service:'conversation'}, function(msg, respond) {
		var body = {};
		if(msg.args && msg.args.body){
			body = JSON.parse(msg.args.body);
		}
		var cookies = msg.request$.cookies;
		msg = {};
		for(var entry in body){
			msg[entry]=body[entry];
		}
		msg.cookies = cookies;
		this.prior(msg,respond);
	})
};




