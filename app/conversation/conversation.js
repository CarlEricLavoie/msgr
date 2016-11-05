module.exports = function conversation() {
	seneca = this;
	var persistenceService = seneca.client({pin: 'service:persistence'});

	seneca.add('service:conversation,cmd:createConversation', (msg, reply) => {
		persistenceService.act(
			{
				service: 'persistence',
				cmd: 'add',
				ref: '/conversation',
				data: {
					admin: '${currentUser}',
					name: 'kdmaskmds'
				}
			}).then((data) => {
			persistenceService.act(
				{
					service: 'persistence',
					cmd: 'add',
					ref: `/user/${currentUser}/conversation`,
					data: {
						admin: '${currentUser}',
						name: 'kdmaskmds'
					}
				});
		});
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
		client.act({service: 'persistence', cmd: 'add', idToken: 1234}, function (answer, response) {
			if (response.answer === "authenticated") {
				console.log(response.answer);
				prior(msg, respond);
			}
		});
		reply(null, {answer: true})
	});

	seneca.wrap('service:conversation', function (msg, respond) {
		var prior = this.prior;
		//add conversation service validation
		client.act({service: 'authentication', cmd: 'verify', idToken: 1234}, function (answer, response) {
			if (response.answer === "authenticated") {
				console.log(response.answer);
				prior(msg, respond);
			}
		});
	});

};




