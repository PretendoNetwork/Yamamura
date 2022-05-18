const Discord = require('discord.js');
const util = require('../util');

/**
 * 
 * @param {Discord.GuildMember} member
 */
async function guildMemberRemoveHandler(member) {
	await util.updateMemberCountChannels(member.guild);
}

module.exports = guildMemberRemoveHandler;