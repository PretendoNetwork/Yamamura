const Discord = require('discord.js');
const buttonHandler = require('../handlers/button-handler');
const commandHandler = require('../handlers/command-handler');
const contextMenuHandler = require('../handlers/context-menu-handler');
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

	if (interaction.isContextMenu()) {
		await contextMenuHandler(interaction);
	}
}

module.exports = interactionCreateHander;