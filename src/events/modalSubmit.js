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
	const modal = modals.find(modal => customId.startsWith(modal.name)); // hack to be able to append extra metadata to modals

	// do nothing if no modal
	if (!modal) {
		interaction.reply(`Missing modal handler for \`${customId}\``);
		return;
	}

	// run the modal
	modal.handler(interaction);
}

module.exports = modalSubmitHandler;