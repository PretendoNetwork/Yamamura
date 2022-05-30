//const Discord = require('discord.js');
const { Modal, TextInputComponent, ModalSubmitInteraction } = require('discord-modals');

const payload = new TextInputComponent();
payload.setCustomId('payload');
payload.setStyle('LONG');
payload.setLabel('Message Payload');
payload.setPlaceholder('http://discohook.org & https://discord.com/developers/docs/resources/channel#message-object for help');
payload.setDefaultValue('{\n\t"content": null,\n\t"embeds": [],\n\t"attachments": [],\n\t"components": []\n}');
payload.setRequired(true);

const sendMessageModal = new Modal();
sendMessageModal.setCustomId('send-message');
sendMessageModal.setTitle('Send message as Yamamura');
sendMessageModal.addComponents(payload);

/**
 *
 * @param {ModalSubmitInteraction} interaction
 */
async function sendMessageHandler(interaction) {
	await interaction.deferReply({
		content: 'Thinking...',
		ephemeral: true
	});

	const payload = interaction.getTextInputValue('payload').trim();

	const messagePayload = JSON.parse(payload);
	await interaction.channel.send(messagePayload);

	await interaction.editReply({
		content: 'Message Sent',
		ephemeral: true
	});
}

module.exports = {
	name: sendMessageModal.customId,
	modal: sendMessageModal,
	handler: sendMessageHandler
};