const Discord = require('discord.js');

/**
 * 
 * @param {Discord.ButtonInteraction} interaction
 */
async function buttonHandler(interaction) {
	const { customId } = interaction;

	/** @type {Discord.Collection} */
	const buttons = interaction.client.buttons;
	const button = buttons.get(customId);

	// do nothing if no button
	if (!button) {
		interaction.reply(`Missing button handler for \`${customId}\``);
		return;
	}

	// run the button
	button.handler(interaction);
}

module.exports = buttonHandler;