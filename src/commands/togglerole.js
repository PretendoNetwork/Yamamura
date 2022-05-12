const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function toggleroleHandler(interaction) {
	interaction.deferReply({
		ephemeral: true
	});

	const roleName = interaction.options.getString('role');
	const member = interaction.member;
	const guild = await interaction.guild.fetch();
	const roles = await guild.roles.fetch();
	const role = roles.find(role => role.name.toLowerCase() === roleName);
	
	if (!role) {
		await interaction.followUp({
			content: 'Unable to find the requested role. Contact and admin as soon as possible',
			ephemeral: true
		});

		return;
	}

	const hasRole = member.roles.cache.has(role.id);
	
	if (hasRole) {
		await member.roles.remove(role);
	} else {
		await member.roles.add(role);
	}

	await interaction.followUp({
		content: `Toggling role ${role.name} [${hasRole ? 'REMOVED' : 'ADDED'}]!`,
		ephemeral: true
	});
}

const command = new SlashCommandBuilder()
	.setDefaultPermission(true)
	.setName('togglerole')
	.setDescription('Toggle user roles')
	.addStringOption(option => {
		return option.setName('role')
			.setDescription('Role to toggle')
			.setRequired(true)
			.addChoice('@Updates', 'updates')
			.addChoice('@StreamPing', 'streamping');
	});

module.exports = {
	handler: toggleroleHandler,
	deploy: command.toJSON()
};