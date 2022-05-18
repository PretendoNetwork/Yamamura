const Discord = require('discord.js');
const util = require('../util');

/**
 * 
 * @param {Discord.GuildMember} member
 */
async function guildMemberAddHandler(member) {
	const welcomeEmbed = new Discord.MessageEmbed();

	welcomeEmbed.setColor(0x1B1F3B);
	welcomeEmbed.setTitle('Pretendo Network');
	welcomeEmbed.setURL('https://pretendo.network');
	welcomeEmbed.setDescription('\u200b');
	welcomeEmbed.setThumbnail('https://i.imgur.com/8clyKqx.png');
	welcomeEmbed.setImage('https://i.imgur.com/CF7qgW1.png');
	welcomeEmbed.addFields([
		{
			name: ':desktop: Social Media',
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
			name: '<:rulestext:886254514141806643> General Rules',
			value: '\u200b'
		},
		{
			name: ':one:',
			value: 'No advertising unless explicitly allowed to do so by one of the developers'
		},
		{
			name: ':two:',
			value: 'Do not share anything illegal. This includes game/firmware dumps, any console SDK or tools/documents protected under an NDA, etc. If you are unsure as to what is illegal to share, err on the side of caution and don\'t'
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

	await member.send({
		content: 'Thank you for joining the Pretendo Network Discord server! Check below for some server information and links',
		embeds: [welcomeEmbed]
	});

	await util.updateMemberCountChannels(member.guild);
}

module.exports = guildMemberAddHandler;