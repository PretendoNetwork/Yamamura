const Discord = require('discord.js');
const db = require('./db');

/**
 * 
 * @param {Discord.Guild} guild
 */
async function updateMemberCountChannels(guild) {
	// TODO this should really done on interval, a bot raid will ratelimit the bot so it cant take any more actions for a while
	// (this is on global ratelimit iirc)

	const memberChannelId = db.getDB().get('stats.channels.members');
	const peopleChannelId = db.getDB().get('stats.channels.people');
	const botsChannelId = db.getDB().get('stats.channels.bots');
	const membersChannel = memberChannelId && await guild.channels.fetch(memberChannelId);
	const peopleChannel = memberChannelId && await guild.channels.fetch(peopleChannelId);
	const botsChannel = memberChannelId && await guild.channels.fetch(botsChannelId);

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

	if (membersChannel) await membersChannel.setName(`Members - ${membersCount}`);
	if (peopleChannel) await peopleChannel.setName(`People - ${peopleCount}`);
	if (botsChannel) await botsChannel.setName(`Bots - ${botsCount}`);
}

module.exports = {
	updateMemberCountChannels
};