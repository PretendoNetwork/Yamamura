const Discord = require('discord.js');

const roleSelectMenu = new Discord.MessageSelectMenu();
roleSelectMenu.setCustomId('role-self-assign');
roleSelectMenu.setMaxValues(1);
roleSelectMenu.setPlaceholder('Select a role to toggle');
roleSelectMenu.addOptions([
	{
		label: '@Updates',
		description: 'Get pinged whenever important server announcements happen',
		value: 'updates',
	},
	{
		label: '@StreamPing',
		description: 'Get pinged whenever a new Twitch stream is beginning',
		value: 'streamping',
	}
]);

/**
 *
 * @param {Discord.SelectMenuInteraction} interaction
 */
async function roleSelfAssignHandler(interaction) {
	await interaction.deferReply({
		ephemeral: true
	});

	const roleName = interaction.values[0];
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

	const { message } = interaction;

	const row = new Discord.MessageActionRow();
	row.addComponents([roleSelectMenu]);

	await message.edit({
		components: [row]
	});

	await interaction.followUp({
		content: `Toggling role ${role.name} [${hasRole ? 'REMOVED' : 'ADDED'}]!`,
		ephemeral: true
	});
}

module.exports = {
	select_menu: roleSelectMenu,
	handler: roleSelfAssignHandler
};