const Discord = require('discord.js');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v10');
const { showModal } = require('discord-modals');
const { modal: reportUserModal } = require('../modals/report-user');

/**
 *
 * @param {Discord.ContextMenuInteraction} interaction
 */
async function reportUserHandler(interaction) {
	const { targetId } = interaction;

	if (targetId=== interaction.user.id) {
		await interaction.reply({
			content: 'Cannot report yourself',
			ephemeral: true
		});
		return;
	}

	const targetMember = await interaction.guild.members.fetch(targetId);

	if (targetMember.user.bot) {
		await interaction.reply({
			content: 'Cannot report bots as users',
			ephemeral: true
		});
		return;
	}

	reportUserModal.setCustomId(`${reportUserModal.customId}-${interaction.targetId}`);
	reportUserModal.setTitle(`Reporting ${targetMember.user.tag}`);

	showModal(reportUserModal, {
		client: interaction.client,
		interaction: interaction
	});
}

const contextMenu = new ContextMenuCommandBuilder();

contextMenu.setDefaultPermission(true);
contextMenu.setName('Report User');
contextMenu.setType(ApplicationCommandType.User);

module.exports = {
	name: contextMenu.name,
	help: 'Report a user. Report will include your provided reason as well as a transcript of a set number of messages in the channel the report was made from.\n```\nUsage: Right click a user and navigate to \'Apps > Report User\'\n```',
	handler: reportUserHandler,
	deploy: contextMenu.toJSON()
};