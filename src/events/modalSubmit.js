const { ModalSubmitInteraction } = require('discord-modals');
const modals = require('../modals-manager');

/**
 * 
 * @param {ModalSubmitInteraction} interaction
 */
async function modalSubmitHandler(interaction) {
	const { customId } = interaction;

	// do nothing if no command
	if (!modals[customId]) {
		interaction.reply(`Missing modal handler for \`${customId}\``);
		return;
	}

	// run the command
	modals[customId].handler(interaction);
}

module.exports = modalSubmitHandler;