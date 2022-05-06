const Discord = require('discord.js');

/**
 *
 * @param {Discord.Message} message
 */
function messageHandler(message) {
	if (message.author.bot) return;

	// Check if the message is a command and handle it
	if (message.content === '.toggleupdates') {
		message.reply('Looks like you tried to use a legacy command! Try our new slash commands by just typing "/"!');
		return;
	}
}

module.exports = messageHandler;