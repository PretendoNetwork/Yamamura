const Discord = require('discord.js');
const cloneDeep = require('lodash.clonedeep');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v10');
const { showModal, TextInputComponent } = require('discord-modals');
const { modal: editMessageModal } = require('../../modals/edit-message');

/**
 *
 * @param {Discord.ContextMenuInteraction} interaction
 */
async function reportUserHandler(interaction) {
	const { targetId } = interaction;

	try {
		const message = await interaction.channel.messages.fetch(targetId);
		
		if (message.author.id !== interaction.client.user.id) {
			throw new Error('Can only manage Yamamura messages with this command');
		}

		const messageJSON = message.toJSON();

		// Only take the properties we need
		const messagePayload = {
			content: messageJSON.content || null,
			embeds: messageJSON.embeds || [],
			attachments: messageJSON.attachments || [],
			components: messageJSON.components || []
		};

		const messageIdInput = new TextInputComponent();
		messageIdInput.setCustomId('message-id');
		messageIdInput.setStyle('SHORT');
		messageIdInput.setLabel('Message ID (DO NOT CHANGE)');
		messageIdInput.setDefaultValue(targetId);
		messageIdInput.setRequired(true);

		const payload = new TextInputComponent();
		payload.setCustomId('payload');
		payload.setStyle('LONG');
		payload.setLabel('Message Payload');
		payload.setPlaceholder('http://discohook.org & https://discord.com/developers/docs/resources/channel#message-object for help');
		payload.setDefaultValue(JSON.stringify(messagePayload, null, 4));
		payload.setRequired(true);

		const modal = cloneDeep(editMessageModal);

		modal.addComponents(messageIdInput, payload);

		await showModal(modal, {
			client: interaction.client,
			interaction: interaction
		});
	} catch (error) {
		await interaction.reply({
			content: error.message,
			ephemeral: true
		});
	}
}

const contextMenu = new ContextMenuCommandBuilder();

contextMenu.setDefaultPermission(false);
contextMenu.setName('Edit Yamamura Message');
contextMenu.setType(ApplicationCommandType.Message);

module.exports = {
	name: contextMenu.name,
	handler: reportUserHandler,
	deploy: contextMenu.toJSON()
};