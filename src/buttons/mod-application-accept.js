const Discord = require('discord.js');
const db = require('../db');

const acceptButton = new Discord.MessageButton();
acceptButton.setCustomId('mod-application-accept');
acceptButton.setLabel('Accept');
acceptButton.setStyle('SUCCESS');

/**
 *
 * @param {Discord.ButtonInteraction} interaction
 */
async function modApplicationAcceptHandler(interaction) {
	await interaction.deferReply({
		ephemeral: true
	});

	const adminRoleId = db.getDB().get('roles.admin');

	if (!adminRoleId) {
		throw new Error('No admin role ID set!');
	}

	const hasdAdminRole = interaction.member.roles.cache.get(adminRoleId);

	if (!hasdAdminRole) {
		throw new Error('Only administrators have permission to accept/deny applications');
	}

	const { message } = interaction;
	const modApplicationEmbed = message.embeds[0];
	const rowOld = message.components[0];
	const [acceptButtonOld, denyButtonOld] = rowOld.components;

	modApplicationEmbed.setColor(0x2D992D);
	modApplicationEmbed.setImage('attachment://accepted-banner.png');
	modApplicationEmbed.setThumbnail('attachment://accepted-icon.png');

	acceptButtonOld.setDisabled();
	denyButtonOld.setDisabled();

	const row = new Discord.MessageActionRow();
	row.addComponents([acceptButtonOld, denyButtonOld]);

	await message.edit({
		embeds: [modApplicationEmbed],
		components: [row],
		files: [
			__dirname + '/../images/accepted-icon.png',
			__dirname + '/../images/accepted-banner.png',
		]
	});

	await interaction.editReply({
		content: 'Accepted mod application',
		ephemeral: true
	});
}

module.exports = {
	name: acceptButton.customId,
	button: acceptButton,
	handler: modApplicationAcceptHandler
};