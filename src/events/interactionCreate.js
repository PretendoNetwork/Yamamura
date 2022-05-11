const Discord = require('discord.js');
const commandHandler = require('../command-handler');

/**
 * 
 * @param {Discord.Interaction} interaction
 */
async function interactionCreateHander(interaction) {
	if (interaction.isCommand()) {
		await commandHandler(interaction);
	}
}

module.exports = interactionCreateHander;