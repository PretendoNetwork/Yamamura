const Discord = require('discord.js');
const setupGuild = require('../setup-guild');

/**
 * 
 * @param {Discord.Client} client
 */
async function readyHandler(client) {
	const guilds = await client.guilds.fetch();

	for (let guild of guilds) {
		guild = await guild[1].fetch();
		await setupGuild(guild);
	}

	console.log(`Logged in as ${client.user.tag}!`);
}

module.exports = readyHandler;