const Discord = require('discord.js');
const buttons = require('./buttons-manager');

/**
 * 
 * @param {Discord.ButtonInteraction} interaction
 */
async function buttonHandler(interaction) {
	const { customId } = interaction;

	// do nothing if no button
	if (!buttons[customId]) {
		interaction.reply(`Missing button handler for \`${customId}\``);
		return;
	}

	// run the button
	buttons[customId].handler(interaction);
}

module.exports = buttonHandler;