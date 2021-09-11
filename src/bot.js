const { SlashCreator, GatewayServer } = require('slash-create');
const Discord = require('discord.js');
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

bot.on('message', message => {
	// Ignore bot messages
	if (message.author.bot) return;

	// Check if the message is a command and handle it
	if (message.content === '.toggleupdates') {
		message.reply('Looks like you tried to use a legacy command! Try our new slash commands by just typing "/"!');
		return;
	}
});

bot.on('guildMemberAdd', member => {
	const embed = new Discord.MessageEmbed();

	embed.setColor(0x1B1F3B);
	embed.setTitle('Pretendo Network');
	embed.setURL('https://pretendo.network');
	embed.setDescription('\u200b');
	embed.setThumbnail('https://i.imgur.com/8clyKqx.png');
	embed.setImage('https://i.imgur.com/CF7qgW1.png');
	embed.addFields([
		{
			name: '📃 Social Media',
			value: '\u200b'
		},
		{
			name: '<:patreonlogo:886254233786138635> Patreon',
			value: 'https://patreon.com/PretendoNetwork'
		},
		{
			name: '<:twitterlogo:886254233962291241> Twitter',
			value: 'https://twitter.com/PretendoNetwork'
		},
		{
			name: '<:twitchlogo:886254234201362473> Twitch',
			value: 'https://twitch.tv/PretendoNetwork'
		},
		{
			name: '<:youtubelogo:886254234226528337> YouTube',
			value: 'https://youtube.com/c/PretendoNetwork'
		},
		{
			name: '\u200b',
			value: '\u200b'
		},
		{
			name: '<:rulestext:886254514141806643> Rules',
			value: '\u200b'
		},
		{
			name: ':one:',
			value: 'No advertising unless explicitly allowed to do so by one of the developers'
		},
		{
			name: ':two:',
			value: 'Do not share anything illegal. This includes illegal game/fw dumps, any console SDK, etc. We are unsure as to what is illegal to share, so keep all that to the DMs just to be safe'
		},
		{
			name: ':three:',
			value: 'Respect channel names and topics. Offtopic chat goes in the offtopic channel'
		},
		{
			name: ':four:',
			value: 'Be kind. If someone asks a question you can help with, be nice about helping them. Know your audience'
		}
	]);

	member.send('Thank you for joining the Pretendo Network Discord server! Check below for some server information and links', { embed });
});

bot.login(config.token).then(() => {
	console.log('ready');
});