const Discord = require('discord.js');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v10');

/**
 *
 * @param {Discord.ContextMenuInteraction} interaction
 */
async function reportUserHandler(interaction) {
	const { targetId } = interaction;

	try {
		const message = await interaction.channel.messages.fetch(targetId);
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

const contextMenu = new ContextMenuCommandBuilder();

contextMenu.setDefaultPermission(false);
contextMenu.setName('Get Message Payload');
contextMenu.setType(ApplicationCommandType.Message);

module.exports = {
	name: contextMenu.name,
	handler: reportUserHandler,
	deploy: contextMenu.toJSON()
};