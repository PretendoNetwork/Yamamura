const Discord = require('discord.js');

/**
 * 
 * @param {Discord.CommandInteraction} interaction
 */
async function commandHandler(interaction) {
	const { commandName } = interaction;

	/** @type {Discord.Collection} */
	const commands = interaction.client.commands;
	const command = commands.get(commandName);

	// do nothing if no command
	if (!command) {
		interaction.reply(`Missing command handler for \`${commandName}\``);
		return;
	}

	// run the command
	command.handler(interaction);
}

module.exports = commandHandler;