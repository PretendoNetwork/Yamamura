const { SlashCreator, GatewayServer } = require('slash-create');
const Discord = require('discord.js');
const config = require('../config.json');

const bot = new Discord.Client();
const creator = new SlashCreator({
	applicationID: config.application_id,
	publicKey: config.public_key,
	token: config.token,
});

const ToggleRoleCommand = require('./commands/togglerole');
const ayyRegex = new RegExp(/\b(ay+)\b/, 'i');

creator
	.withServer(
		new GatewayServer(
			(handler) => bot.ws.on('INTERACTION_CREATE', handler)
		)
	)
	.registerCommands([
		new ToggleRoleCommand(bot, creator)
	])
	.syncCommands();

bot.on('message', message => {

	// Ignore bot messages
	if (message.author.bot) return;

	// Check if the message is a command and handle it
	if (message.content === '.toggleupdates') {
		message.reply('looks like you tried to use a legacy command! Try our new slash commands by just typing "/"!');
		return;
	}

	// Replace ays with lmaos
	if (ayyRegex.test(message.content)) {

		let messageArray = message.content.split(ayyRegex)
		messageArray.forEach((entry, index) => {

			// Return if the entry doesn't contain anything to replace
			if (!ayyRegex.test(entry)) return;

			// Replace anything there is to replace
			else {
				messageArray[index] = messageArray[index]
					.replace(/y/g, 'o')
					.replace(/Y/g, 'O')
					.replace('a', 'lma')
					.replace('A', 'LMA')
			}
		});

		let lmaodMessage = messageArray.join('');
		// Check if the message is too big to send
		if (lmaodMessage.length < 2000) {
			message.channel.send(lmaodMessage);
		} else {
			message.channel.send('The resulting message is too long :/');
		}
	};
});

bot.login(config.token).then(() => {
	console.log('ready');
});