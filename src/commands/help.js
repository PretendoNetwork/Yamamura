const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function helpHandler(interaction) {
	await interaction.deferReply({
		ephemeral: true
	});

	const commandName = interaction.options.getString('command');

	const helpEmbed = new Discord.MessageEmbed();
	helpEmbed.setColor(0x287E29);
	helpEmbed.setTitle('Pretendo Network Help');
	helpEmbed.setFooter({
		text: 'Pretendo Network',
		iconURL: interaction.guild.iconURL()
	});

	if (!commandName) {
		helpEmbed.setDescription('To get detailed information about a command, use `/help <command name>` or `/<command name>` to check the commands description\n\nAll commands are Discord application commands with ephemeral (only visible to you) responses. Context Menu commands are visible via right clicking on a message or user and navigating to `Apps > <command name>`');
		helpEmbed.setFields([
			{
				'name': 'Commands',
				'value': '```\nhelp\nmod-application\ntogglerole\n```',
				'inline': true
			},
			{
				'name': 'Context Menus',
				'value': '```\nReport User\n```',
				'inline': true
			}
		]);
	} else {
		const [collection, key] = commandName.split(':');

		helpEmbed.setFields([
			{
				'name': key,
				'value': interaction.client[collection].get(key).help
			}
		]);
	}

	await interaction.followUp({
		embeds: [helpEmbed],
		ephemeral: true
	});
}

const command = new SlashCommandBuilder();

command.setDefaultPermission(true);
command.setName('help');
command.setDescription('Get help');
command.addStringOption(option => {
	option.setName('command');
	option.setDescription('Command Name');
	option.setRequired(false);

	option.addChoice('/help', 'commands:help');
	option.addChoice('/mod-application', 'commands:mod-application');
	option.addChoice('/togglerole', 'commands:togglerole');
	option.addChoice('Report User', 'contextMenus:Report User');

	return option;
});

module.exports = {
	name: command.name,
	help: 'Get detailed help about the server and commands.\n```\nUsage: /help <command>\n```',
	handler: helpHandler,
	deploy: command.toJSON()
};