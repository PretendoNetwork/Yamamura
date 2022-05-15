const Discord = require('discord.js');

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
	button: acceptButton,
	handler: modApplicationAcceptHandler
};