const Discord = require('discord.js');
const { ModalSubmitInteraction } = require('discord-modals');

/**
 * 
 * @param {ModalSubmitInteraction} interaction
 */
async function modalSubmitHandler(interaction) {
	try {
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
		await modal.handler(interaction);
	} catch (error) {
		const payload = {
			content: error.message || 'Missing error message',
			ephemeral: true
		};

		try {
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply(payload);
			} else {
				await interaction.reply(payload);
			}
		} catch (replyError) {
			console.log(replyError, error);
		}
	}
}

module.exports = modalSubmitHandler;