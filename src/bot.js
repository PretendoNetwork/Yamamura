const Discord = require('discord.js');
const discordModals = require('discord-modals');
const setupGuild = require('./setup-guild');
const guildMemberAddHandler = require('./events/guildMemberAdd');
const modalSubmitHandler = require('./events/modalSubmit');
const messageCreateHandler = require('./events/messageCreate');
const interactionCreateHandler = require('./events/interactionCreate');
const config = require('../config.json');

const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
	]
});

discordModals(client);

client.on('ready', async () => {
	const guilds = await client.guilds.fetch();

	for (let guild of guilds) {
		guild = await guild[1].fetch();
		setupGuild(guild);
	}

	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', guildMemberAddHandler);
client.on('modalSubmit', modalSubmitHandler);
client.on('messageCreate', messageCreateHandler);
client.on('interactionCreate', interactionCreateHandler);

client.login(config.bot_token);