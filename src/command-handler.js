const Discord = require('discord.js');
const commands = require('./commands-manager');

/**
 * 
 * @param {Discord.Interaction} interaction
 */
async function commandHandler(interaction) {
	if (!interaction.isCommand()) return;

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