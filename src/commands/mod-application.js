const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { showModal } = require('discord-modals');
const { modal: modApplicationModal } = require('../modals/mod-application');

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function modApplicationHandler(interaction) {
	showModal(modApplicationModal, {
		client: interaction.client,
		interaction: interaction
	});
}

const command = new SlashCommandBuilder()
	.setDefaultPermission(true)
	.setName('mod-application')
	.setDescription('Apply for a position as a moderator');

module.exports = {
	name: command.name,
	handler: modApplicationHandler,
	deploy: command.toJSON()
};