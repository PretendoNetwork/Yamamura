const Discord = require('discord.js');
const discordModals = require('discord-modals');
const readyHandler = require('./events/ready');
const guildMemberAddHandler = require('./events/guildMemberAdd');
const guildMemberRemoveHandler = require('./events/guildMemberRemove');
const interactionCreateHandler = require('./events/interactionCreate');
const messageCreateHandler = require('./events/messageCreate');
const modalSubmitHandler = require('./events/modalSubmit');
const config = require('../config.json');

const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
	]
});

discordModals(client);

client.buttons = new Discord.Collection();
client.commands = new Discord.Collection();
client.contextMenus = new Discord.Collection();
client.modals = new Discord.Collection();
client.selectMenus = new Discord.Collection();

client.on('ready', readyHandler);
client.on('guildMemberAdd', guildMemberAddHandler);
client.on('guildMemberRemove', guildMemberRemoveHandler);
client.on('interactionCreate', interactionCreateHandler);
client.on('messageCreate', messageCreateHandler);
client.on('modalSubmit', modalSubmitHandler);

client.login(config.bot_token);