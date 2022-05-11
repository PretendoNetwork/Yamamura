const Discord = require('discord.js');

/**
 *
 * @param {Discord.Message} message
 */
async function messageCreateHandler(message) {
	if (message.author.bot) return;

	// Check if the message is a command and handle it
	if (message.content === '.toggleupdates') {
		message.reply('Looks like you tried to use a legacy command! Try our new slash commands by just typing "/"!');
		return;
	}

	const channel = await message.channel.fetch();
	const guild = await channel.guild.fetch();
	const roles = await guild.roles.fetch();
	const memberRole = roles.find(role => role.name === 'member');
	const unverifiedRole = roles.find(role => role.name === 'unverified');

	if (channel.name === 'readme' && channel.type === 'GUILD_TEXT' && channel.parent?.name === 'pretendo') {
		const member = await message.member.fetch();
		if (!member.roles.cache.has(memberRole.id) && member.roles.cache.has(unverifiedRole.id)) {
			await member.roles.add(unverifiedRole);
		}
	}
}

module.exports = messageCreateHandler;