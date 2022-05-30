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
		throw new Error(`Missing command handler for \`${commandName}\``);
	}

	// run the command
	await command.handler(interaction);
}

module.exports = commandHandler;