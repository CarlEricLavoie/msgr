module.exports = function conversation() {
	seneca = this;
	var persistenceService = seneca.client({pin: 'service:persistence', port: 4027, type: 'tcp'});

	seneca.add({service: 'conversation', cmd: 'createConversation'}, (msg, reply) => {

		persistenceService.act(
			{
				service: 'persistence',
				cmd: 'add',
				ref: '/conversation',
				idToken: msg.idToken,
				data: {
					admin: '{userId}',
					name: msg.name,
					users: {
						'{userId}' : true
					}
				}
			}, (reply, response) => {
				persistenceService.act({
					service: 'persistence',
					cmd: 'set',
					ref: `/user/{userId}/conversations/${response.key}`,
					idToken: msg.idToken,
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
				idToken: msg.idToken
			}, (err, result) => {

				var itemsLength = Object.keys(result.answer).length;
				function replyHandler(convoId){
					return function(err, result){
						result.answer.id=convoId;
						convos.push(result.answer);
						if(convos.length >= itemsLength){
							reply(null, convos);
						}
					}
				}

				for(convo in result.answer){
					persistenceService.act({
						service: 'persistence',
						cmd: 'get',
						ref: `/conversation/${convo}`,
						idToken: msg.idToken
					}, replyHandler(convo))
				}
			});
	});


	seneca.add({service: 'conversation', cmd: 'getConversation'}, (msg, reply) => {
		persistenceService.act({
			service: 'persistence',
			cmd: 'get',
			ref: `/user/{userId}/conversations/`,
			idToken: msg.idToken
		}, (err, result) => {
			var hasConvo = false;
			for( var convoId in result.answer){
				if(convoId == msg.conversationId){
					hasConvo = true
				}
			}
			if(hasConvo){
				persistenceService.act({
					service: 'persistence',
					cmd: 'get',
					ref: `/conversation/${msg.conversationId}`,
					idToken: msg.idToken
				}, (err, result) => {
					result.answer.id = msg.conversationId;
					reply(null, result)
				});
			}else{
				reply(null, {answer: 'Conversation id is not valid for current user.'})
			}
		});
	});

	seneca.add({service: 'conversation', cmd: 'getUsers'}, (msg, reply) => {
		persistenceService.act({
			service: 'persistence',
			cmd: 'get',
			ref: `/conversation/${msg.conversationId}/users`,
			idToken: msg.idToken
		}, (err, result) => {

			var users = [];
			var itemsLength = Object.keys(result.answer).length;
			function replyHandler(){
				return function(err, result){
					users.push(result.answer);
					if(users.length >= itemsLength){
						reply(null, users);
					}
				}
			}

			for(var userId in result.answer){
				persistenceService.act({
					service: 'persistence',
					cmd: 'get',
					ref: `/user/${userId}`,
					idToken: msg.idToken
				}, replyHandler())
			}
		});
	});

	seneca.add({service: 'conversation', cmd: 'addUser'}, (msg, reply) => {
		persistenceService.act({
			service: 'persistence',
			cmd: 'get',
			ref: `/conversation/${msg.conversationId}/admin/`,
			idToken: msg.idToken
		}, (err, result) => {
			if(result.answer){
				if(true){ //todo: add proper condition
					persistenceService.act({
						service: 'persistence',
						cmd: 'set',
						ref: `/user/${msg.userId}/conversations/${msg.conversationId}`,
						idToken: msg.idToken,
						data : true
					}, () => {})

					persistenceService.act({
						service: 'persistence',
						cmd: 'set',
						ref: `/conversation/${msg.conversationId}/users/${msg.userId}`,
						idToken: msg.idToken,
						data : true
					}, () => {})
				}
			}
		});
		reply(null, {})
	});


	seneca.add({service: 'conversation', cmd: 'getMessages'}, (msg, reply) => {

		persistenceService.act({
			service: 'persistence',
			cmd: 'get',
			ref: `/user/{userId}/conversations/`,
			idToken: msg.idToken
		}, (err, result) => {
			var hasConvo = false;
			for( var convoId in result.answer){
				if(convoId == msg.conversationId){
					hasConvo = true
				}
			}
			if(hasConvo){
				persistenceService.act({
					service: 'persistence',
					cmd: 'get',
					ref: `/conversation/${msg.conversationId}/messages`,
					idToken: msg.idToken
				}, (err, result) => {
					var messages = [];
					for(msgIndex in result.answer){
						messages.push(result.answer[msgIndex]);
					}
					reply(null, messages)
				});
			}else{
				reply(null, {answer: 'Conversation id is not valid for current user.'})
			}
		});
	});

	seneca.add({service: 'conversation', cmd: 'sendMessage'}, (msg, reply) => {
		persistenceService.act(
			{
				service: 'persistence',
				cmd: 'add',
				ref: `/conversation/${msg.conversationId}/messages`,
				idToken: msg.idToken,
				data: {
					msg: `${msg.msg}`,
					timestamp: Date.now(),
					sender : '{userId}'
				}
			});
		reply(null, {answer: "success"})
	});




	seneca.wrap({service:'conversation'}, function(msg, respond) {
		var body = {};
		if(msg.args && msg.args.body){
			body = JSON.parse(msg.args.body);
		}

		msgObj = {};
		for(var entry in body){
			msgObj[entry]=body[entry];
		}
		for(var entry in msg.args.query){
			msgObj[entry]=msg.args.query[entry];
		}
		// msg.cookies = cookies;
		this.prior(msgObj,respond);
	})
};




