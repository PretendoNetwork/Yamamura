const Discord = require('discord.js');

/**
 *
 * @param {Discord.Guild} guild
 */

async function updateMemberCountChannels(guild) {
	const channels = await guild.channels.fetch();

	const membersChannel = channels.find(channel => channel.type === 'GUILD_VOICE' && channel.name.startsWith('Members'));
	const peopleChannel = channels.find(channel => channel.type === 'GUILD_VOICE' && channel.name.startsWith('People'));
	const botsChannel = channels.find(channel => channel.type === 'GUILD_VOICE' && channel.name.startsWith('Bots'));

	const members = await guild.members.fetch();
	const membersCount = guild.memberCount;
	let peopleCount = 0;
	let botsCount = 0;

	// Only loop once
	members.forEach(member => {
		if (member.user.bot) {
			botsCount += 1;
		} else {
			peopleCount += 1;
		}
	});

	await membersChannel.setName(`Members - ${membersCount}`);
	await peopleChannel.setName(`People - ${peopleCount}`);
	await botsChannel.setName(`Bots - ${botsCount}`);
}

module.exports = {
	updateMemberCountChannels
};