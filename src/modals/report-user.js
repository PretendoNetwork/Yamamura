const Discord = require('discord.js');
const { Modal, TextInputComponent, ModalSubmitInteraction } = require('discord-modals');
const discordTranscripts = require('discord-html-transcripts');

const reason = new TextInputComponent()
	.setCustomId('reason')
	.setLabel('Reason')
	.setStyle('LONG')
	.setRequired(true);

const transcriptCount = new TextInputComponent()
	.setCustomId('transcript-count')
	.setLabel('Transcript')
	.setStyle('SHORT')
	.setPlaceholder('Number of messages to inlucde. 0-100. Default 20');

const reportUserModal = new Modal()
	.setCustomId('report-user')
	.setTitle('Reporting User')
	.addComponents(reason, transcriptCount);

/**
 *
 * @param {ModalSubmitInteraction} interaction
 */
async function reportUserHandler(interaction) {
	await interaction.deferReply({
		content: 'Thinking...',
		ephemeral: true
	});

	const parts = interaction.customId.split('-');
	const targetId = parts[2];
	const targetMember = await interaction.guild.members.fetch(targetId);

	const reason = interaction.getTextInputValue('reason').trim();
	let transcriptCount = interaction.getTextInputValue('transcript-count')?.trim();

	if (transcriptCount === '' || isNaN(transcriptCount)) {
		transcriptCount = 20;
	} else {
		transcriptCount = parseInt(transcriptCount);
	}

	const channels = await interaction.guild.channels.fetch();
	const reportsChannel = channels.find(channel => channel.type === 'GUILD_TEXT' && channel.name === 'reports');

	const reportEmbed = new Discord.MessageEmbed();

	reportEmbed.setColor(0xC0C0C0);
	reportEmbed.setTitle('User Report');
	reportEmbed.setDescription('――――――――――――――――――――――――――――――――――');
	reportEmbed.setFields(
		{
			name: 'Target User',
			value: `<@${targetMember.id}>`,
			inline: true
		},
		{
			name: 'Target User ID',
			value: targetMember.id,
			inline: true
		},
		{
			name: '\u200b',
			value: '\u200b'
		},
		{
			name: 'Reporting User',
			value: `<@${interaction.member.id}>`,
			inline: true
		},
		{
			name: 'Reporting User ID',
			value: interaction.member.id,
			inline: true
		},
		{
			name: '\u200b',
			value: '\u200b'
		},
		{
			name: 'Channel Tag',
			value: `<#${interaction.channelId}>`,
			inline: true
		},
		{
			name: 'Channel Name',
			value: interaction.channel.name,
			inline: true
		},
		{
			name: 'Reason',
			value: reason
		}
	);
	reportEmbed.setFooter({
		text: 'Pretendo Network',
		iconURL: interaction.guild.iconURL()
	});
	reportEmbed.setTimestamp(Date.now());

	const transcript = await discordTranscripts.createTranscript(interaction.channel, {
		limit: transcriptCount,
		fileName: 'transcript.html',
		minify: true
	});

	const message = await reportsChannel.send({
		embeds: [reportEmbed],
		files: [transcript]
	});

	const transcriptButton = new Discord.MessageButton();
	transcriptButton.setEmoji('📜');
	transcriptButton.setLabel('Download Transcript');
	transcriptButton.setStyle('LINK');
	transcriptButton.setURL(message.attachments.first().url);

	const row = new Discord.MessageActionRow();
	row.addComponents([transcriptButton]);

	await message.edit({
		components: [row]
	});

	await interaction.editReply({
		content: 'Application submitted!',
		ephemeral: true
	});
}

module.exports = {
	name: reportUserModal.customId,
	modal: reportUserModal,
	handler: reportUserHandler
};