const Discord = require('discord.js');
const commandHandler = require('../handlers/command-handler');
const buttonHandler = require('../handlers/button-handler');
const selectMenuHandler = require('../handlers/select-menu-handler');

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