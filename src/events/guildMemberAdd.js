const Discord = require('discord.js');
const util = require('../util');

/**
 * 
 * @param {Discord.GuildMember} member
 */
async function guildMemberAddHandler(member) {
	const guild = member.guild;
	const channels = await guild.channels.fetch();
	const readmeChannel = channels.find(channel => channel.type === 'GUILD_TEXT' && channel.name === 'readme');
	const rulesChannel = channels.find(channel => channel.type === 'GUILD_TEXT' && channel.name === 'rules');


	const welcomeEmbed = new Discord.MessageEmbed();

	welcomeEmbed.setColor(0x1B1F3B);
	welcomeEmbed.setTitle('Welcome to Pretendo Network :tada:');
	welcomeEmbed.setURL('https://pretendo.network');
	welcomeEmbed.setDescription(`**Thank you for joining the Pretendo Network Discord server! Be sure to refer to the <#${readmeChannel.id}> and <#${rulesChannel.id}> channels for detailed information about the server**\n\n_**Links**_:\nWebsite - https://pretendo.network\nGitHub - https://github.com/PretendoNetwork\nPatreon - https://patreon.com/PretendoNetwork\nTwitter -  https://twitter.com/PretendoNetwork\nTwitch - https://twitch.tv/PretendoNetwork\nYouTube - https://youtube.com/c/PretendoNetwork`);
	welcomeEmbed.setThumbnail('https://i.imgur.com/8clyKqx.png');
	welcomeEmbed.setImage('https://i.imgur.com/CF7qgW1.png');

	await member.send({
		embeds: [welcomeEmbed],
	});

	await util.updateMemberCountChannels(member.guild);
}

module.exports = guildMemberAddHandler;