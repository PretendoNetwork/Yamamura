const Discord = require('discord.js');

/**
 * 
 * @param {Discord.GuildChannel} channel
 */
async function channelCreateHandler(channel) {
	const guild = await channel.guild.fetch();
	const roles = await guild.roles.fetch();
	const unverifiedRole = roles.find(role => role.name === 'unverified');

	await channel.permissionOverwrites.edit(unverifiedRole, {
		SEND_MESSAGES: false,
		MANAGE_MESSAGES: false,
		ADD_REACTIONS: false,
		SPEAK: false,
		VIEW_CHANNEL: false,
		READ_MESSAGE_HISTORY: true,
		USE_APPLICATION_COMMANDS: false,
	});
}

module.exports = channelCreateHandler;