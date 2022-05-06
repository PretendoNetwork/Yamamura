const { SlashCreator, GatewayServer } = require('slash-create');
const Discord = require('discord.js');
const guildMemberAddHandler = require('./events/guildMemberAddHandler');
const messageHandler = require('./events/message');
const config = require('../config.json');

const intents = ['GUILDS', 'GUILD_MEMBERS'];
const bot = new Discord.Client({
	intents: intents,
	ws: {
		intents: intents
	}
});
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

bot.on('guildMemberAdd', guildMemberAddHandler);
bot.on('message', messageHandler);

bot.login(config.token).then(() => {
	console.log('ready');
});