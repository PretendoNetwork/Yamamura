//const Discord = require('discord.js');
const { Modal, ModalSubmitInteraction } = require('discord-modals');

const editMessageModal = new Modal();
editMessageModal.setCustomId('edit-message');
editMessageModal.setTitle('Edit message sent as Yamamura');

/**
 *
 * @param {ModalSubmitInteraction} interaction
 */
async function editMessageHandler(interaction) {
	await interaction.deferReply({
		content: 'Thinking...',
		ephemeral: true
	});
	
	const messageId = interaction.getTextInputValue('message-id').trim();
	const payload = interaction.getTextInputValue('payload').trim();

	try {
		const message = await interaction.channel.messages.fetch(messageId);
		const messagePayload = JSON.parse(payload);
		await message.edit(messagePayload);
	} catch (error) {
		await interaction.editReply({
			content: error.message,
			ephemeral: true
		});

		return;
	}

	await interaction.editReply({
		content: 'Message Edited',
		ephemeral: true
	});
}

module.exports = {
	name: editMessageModal.customId,
	modal: editMessageModal,
	handler: editMessageHandler
};