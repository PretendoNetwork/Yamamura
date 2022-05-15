const Discord = require('discord.js');

const denyButton = new Discord.MessageButton();
denyButton.setCustomId('mod-application-deny');
denyButton.setLabel('Deny');
denyButton.setStyle('DANGER');

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

	modApplicationEmbed.setColor(0xFF0000);
	modApplicationEmbed.setImage('attachment://denied-banner.png');
	modApplicationEmbed.setThumbnail('attachment://denied-icon.png');

	acceptButtonOld.setDisabled();
	denyButtonOld.setDisabled();

	const row = new Discord.MessageActionRow();
	row.addComponents([acceptButtonOld, denyButtonOld]);

	await message.edit({
		embeds: [modApplicationEmbed],
		components: [row],
		files: [
			__dirname + '/../images/denied-icon.png',
			__dirname + '/../images/denied-banner.png',
		]
	});

	await interaction.editReply({
		content: 'Denied mod application',
		ephemeral: true
	});
}

module.exports = {
	button: denyButton,
	handler: modApplicationAcceptHandler
};