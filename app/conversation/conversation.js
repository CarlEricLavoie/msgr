module.exports = function conversation() {
	seneca = this;
	var persistenceService = seneca.client({pin: 'service:persistence', port: 4027, type: 'tcp'});

	seneca.add('service:conversation,cmd:createConversation', (msg, reply) => {
		var body = JSON.parse(msg.args.body);
		if (!body.data) {
			console.warn('invalid data');
			reply(null, {answer: "invalid call to user::createUser"});
			return;
		}

		persistenceService.act(
			{
				service: 'persistence',
				cmd: 'add',
				ref: '/conversation',
				idToken: body.idToken,
				data: {
					admin: '{userId}',
					name: body.name
				}
			}, (reply, response) => {
				persistenceService.act({
					service: 'persistence',
					cmd: 'set',
					ref: `/user/{userId}/conversations/${response.key}`,
					idToken: body.idToken,
					data: true
				});
				console.log(response);
			});
		// , (data) => {
		// persistenceService.act(
		// 	{
		// 		service: 'persistence',
		// 		cmd: 'add',
		// 		idToken : body.idToken,
		// 		ref: `/user/{uuid}/conversation`,
		// 		data: {
		// 			admin: '${currentUser}',
		// 			name: 'kdmaskmds'
		// 		}
		// 	});
		//todo get ID from convo

		reply(null, {answer: "conversation created"})
	});

	seneca.add({service: 'conversation', cmd: 'getConversations'}, (msg, reply) => {
		persistenceService.act({
			service: 'persistence',
			cmd: 'get',
			ref: `/user/${currentUser}/conversation`
		})
	});

	seneca.add({service: 'conversation', cmd: 'getMessages'}, (msg, reply) => {
		reply(null, {answer: true})
	});

	seneca.add({service: 'conversation', cmd: 'sendMessage'}, (msg, reply) => {
		persistenceService.act(
			{
				service: 'persistence',
				cmd: 'add',
				ref: '/conversation/{conversationID}',
				idToken: body.idToken,
				data: {
					admin: '{userId}',
					name: body.name
				}
			});
	});
};




