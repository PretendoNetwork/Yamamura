const Discord = require('discord.js');
const commands = require('./commands-manager');

/**
 * 
 * @param {Discord.CommandInteraction} interaction
 */
async function commandHandler(interaction) {
	const { commandName } = interaction;

	// do nothing if no command
	if (!commands[commandName]) {
		interaction.reply(`Missing command handler for \`${commandName}\``);
		return;
	}

	// run the command
	commands[commandName].handler(interaction);
}

module.exports = commandHandler;