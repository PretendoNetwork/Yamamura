const Discord = require('discord.js');
const cloneDeep = require('lodash.clonedeep');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { showModal, TextInputComponent } = require('discord-modals');
const { modal: sendMessageModal } = require('../modals/send-message');
const { modal: editMessageModal } = require('../modals/edit-message');

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function messageHandler(interaction) {
	const action = interaction.options.getString('action');
	
	if (action === 'send') {
		await showModal(sendMessageModal, {
			client: interaction.client,
			interaction: interaction
		});
	} else if (action === 'edit') {
		try {
			const messageId = interaction.options.getString('message-id');

			if (!messageId) {
				throw new Error('Message ID is required for this action');
			}

			/*
				Make these components here to keep them in the right order
				and to set the default values
			*/

			const message = await interaction.channel.messages.fetch(messageId);

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
			messageIdInput.setDefaultValue(messageId);
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

			return;
		}
	} else if (action === 'get-payload') {
		const messageId = interaction.options.getString('message-id');

		if (!messageId) {
			if (!messageId) {
				throw new Error('Message ID is required for this action');
			}
		}

		try {
			const message = await interaction.channel.messages.fetch(messageId);

			const messageJSON = message.toJSON();

			// Only take the properties we need
			const messagePayload = {
				content: messageJSON.content || null,
				embeds: messageJSON.embeds || [],
				attachments: messageJSON.attachments || [],
				components: messageJSON.components || []
			};

			await interaction.reply({
				content: 'Message Payload Attached',
				files: [
					new Discord.MessageAttachment(Buffer.from(JSON.stringify(messagePayload)), 'message-payload.json')
				],
				ephemeral: true
			});
		} catch (error) {
			await interaction.reply({
				content: error.message,
				ephemeral: true
			});

			return;
		}
	}
}

const command = new SlashCommandBuilder();

command.setDefaultPermission(false);
command.setName('message');
command.setDescription('Send and manage Yamamura messages');
command.addStringOption(option => {
	option.setName('action');
	option.setDescription('Action to make');
	option.setRequired(true);

	option.addChoice('Send Message', 'send');
	option.addChoice('Edit Message', 'edit');
	option.addChoice('Get Payload', 'get-payload');

	return option;
});

command.addStringOption(option => {
	option.setName('message-id');
	option.setDescription('Message ID');
	option.setRequired(false);

	return option;
});

module.exports = {
	name: command.name,
	handler: messageHandler,
	deploy: command.toJSON()
};