const Discord = require('discord.js');
const { ModalSubmitInteraction } = require('discord-modals');

/**
 * 
 * @param {ModalSubmitInteraction} interaction
 */
async function modalSubmitHandler(interaction) {
	const { customId } = interaction;

	/** @type {Discord.Collection} */
	const modals = interaction.client.modals;
	const modal = modals.get(customId);

	// do nothing if no modal
	if (!modal) {
		interaction.reply(`Missing modal handler for \`${customId}\``);
		return;
	}

	// run the modal
	modal.handler(interaction);
}

module.exports = modalSubmitHandler;