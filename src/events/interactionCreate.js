const Discord = require('discord.js');
const commandHandler = require('../command-handler');
const buttonHandler = require('../button-handler');

/**
 * 
 * @param {Discord.Interaction} interaction
 */
async function interactionCreateHander(interaction) {
	if (interaction.isCommand()) {
		await commandHandler(interaction);
	}

	if (interaction.isButton()) {
		await buttonHandler(interaction);
	}
}

module.exports = interactionCreateHander;