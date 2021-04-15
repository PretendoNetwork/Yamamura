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
		message.reply('Looks like you tried to use a legacy command! Try our new slash commands by just typing "/"!');
		return;
	}
});

bot.login(config.token).then(() => {
	console.log('ready');
});