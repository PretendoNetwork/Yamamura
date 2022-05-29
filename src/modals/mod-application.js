const Discord = require('discord.js');
const { ModalSubmitInteraction } = require('discord-modals');
const { Modal, TextInputComponent } = require('discord-modals');
const { button: acceptButton } = require('../buttons/mod-application-accept');
const { button: denyButton } = require('../buttons/mod-application-deny');

const inServerSince = new TextInputComponent()
	.setCustomId('experience')
	.setLabel('Do you have prior experience and if so, what?')
	.setStyle('SHORT')
	.setRequired(true);

const timezone = new TextInputComponent()
	.setCustomId('timezone')
	.setLabel('What is your timezone?')
	.setStyle('SHORT')
	.setRequired(true);

const availablity = new TextInputComponent()
	.setCustomId('availablity')
	.setLabel('What is your availablity?')
	.setStyle('SHORT')
	.setRequired(true);

const why = new TextInputComponent()
	.setCustomId('why')
	.setLabel('Why do you want to become a moderator?')
	.setStyle('SHORT')
	.setRequired(true);

const extra = new TextInputComponent()
	.setCustomId('extra')
	.setLabel('What else can you tell us about yourself?')
	.setStyle('LONG')
	.setRequired(true);


const modApplicationModal = new Modal()
	.setCustomId('mod-application')
	.setTitle('Moderator Application')
	.addComponents(inServerSince, timezone, availablity, why, extra);

/**
 *
 * @param {ModalSubmitInteraction} interaction
 */
async function modApplicationHandler(interaction) {
	await interaction.deferReply({
		content: 'Thinking...',
		ephemeral: true
	});

	const experience = interaction.getTextInputValue('experience');
	const timezone = interaction.getTextInputValue('timezone');
	const availablity = interaction.getTextInputValue('availablity');
	const why = interaction.getTextInputValue('why');
	const extra = interaction.getTextInputValue('extra');

	const applyingMember = await interaction.member.fetch();
	const guild = await interaction.guild.fetch();

	const channels = await guild.channels.fetch();
	const channel = channels.find(channel => channel.type === 'GUILD_TEXT' && channel.name === 'mod-applications');

	const modApplicationEmbed = new Discord.MessageEmbed();

	modApplicationEmbed.setColor(0x0096FF);
	modApplicationEmbed.setTitle('Mod Application');
	modApplicationEmbed.setDescription('A user has submitted a moderator application');
	modApplicationEmbed.setImage('attachment://pending-banner.png');
	modApplicationEmbed.setThumbnail('attachment://pending-icon.png');
	modApplicationEmbed.setAuthor({
		name: applyingMember.user.tag,
		iconURL: applyingMember.user.avatarURL()
	});
	modApplicationEmbed.setFields([
		{
			name: 'Do you have prior experience and if so, what?',
			value: experience
		},
		{
			name: 'What is your timezone?',
			value: timezone
		},
		{
			name: 'What is your availablity?',
			value: availablity
		},
		{
			name: 'Why do you want to become a moderator?',
			value: why
		},
		{
			name: 'What else can you tell us about yourself?',
			value: extra
		}
	]);
	modApplicationEmbed.setFooter({
		text: 'Pretendo Network',
		iconURL: guild.iconURL()
	});
	modApplicationEmbed.setTimestamp(Date.now());

	const row = new Discord.MessageActionRow();
	row.addComponents([acceptButton, denyButton]);

	await channel.send({
		embeds: [modApplicationEmbed],
		components: [row],
		files: [
			__dirname + '/../images/pending-icon.png',
			__dirname + '/../images/pending-banner.png',
		]
	});

	await interaction.editReply({
		content: 'Application submitted!',
		ephemeral: true
	});
}

module.exports = {
	name: modApplicationModal.customId,
	modal: modApplicationModal,
	handler: modApplicationHandler
};