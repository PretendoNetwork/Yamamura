const Discord = require('discord.js');
const commandHandler = require('../command-handler');
const buttonHandler = require('../button-handler');
const selectMenuHandler = require('../select-menu-handler');

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

	if (interaction.isSelectMenu()) {
		await selectMenuHandler(interaction);
	}
}

module.exports = interactionCreateHander;