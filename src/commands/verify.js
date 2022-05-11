const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, showModal } = require('discord-modals');


// Select Menus are not valid message components for modals
// Need to use text inputs
const isPiracyAllowed = new TextInputComponent()
	.setCustomId('is-piracy-allowed')
	.setLabel('Is piracy allowed?')
	.setStyle('SHORT')
	.setMinLength(2)
	.setMaxLength(3)
	.setRequired(true);

const sexismIsNotAllowed = new TextInputComponent()
	.setCustomId('sexism-is-not-allowed')
	.setLabel('Sexism is not allowed, correct?')
	.setStyle('SHORT')
	.setMinLength(2)
	.setMaxLength(3)
	.setRequired(true);

const isSwearingAllowed = new TextInputComponent()
	.setCustomId('is-swearing-allowed')
	.setLabel('Is swearing allowed?')
	.setStyle('SHORT')
	.setMinLength(2)
	.setMaxLength(3)
	.setRequired(true);

const spamGeneral = new TextInputComponent()
	.setCustomId('can-spam-general')
	.setLabel('Can you spam the #general channel?')
	.setStyle('SHORT')
	.setMinLength(2)
	.setMaxLength(3)
	.setRequired(true);


const verifyModal = new Modal()
	.setCustomId('verify')
	.setTitle('Answer either `yes` or `no`')
	.addComponents(isPiracyAllowed, sexismIsNotAllowed, isSwearingAllowed, spamGeneral);

/**
 *
 * @param {Discord.Interaction} interaction
 */
async function verifyHandler(interaction) {
	showModal(verifyModal, {
		client: interaction.client, // Client to show the Modal through the Discord API.
		interaction: interaction // Show the modal with interaction data.
	});
}

const command = new SlashCommandBuilder()
	.setDefaultPermission(true)
	.setName('verify')
	.setDescription('Verify the member has read the rules');

module.exports = {
	handler: verifyHandler,
	deploy: command.toJSON()
};