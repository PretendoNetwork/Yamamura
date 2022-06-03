const Discord = require('discord.js');
const buttonHandler = require('../handlers/button-handler');
const commandHandler = require('../handlers/command-handler');
const contextMenuHandler = require('../handlers/context-menu-handler');
const selectMenuHandler = require('../handlers/select-menu-handler');

/**
 * 
 * @param {Discord.Interaction} interaction
 */
async function interactionCreateHander(interaction) {
	try {
		if (interaction.isCommand()) {
			await commandHandler(interaction);
		}

		if (interaction.isButton()) {
			await buttonHandler(interaction);
		}

		if (interaction.isSelectMenu()) {
			await selectMenuHandler(interaction);
		}

		if (interaction.isContextMenu()) {
			await contextMenuHandler(interaction);
		}
	} catch (error) {
		const payload = {
			content: error.message || 'Missing error message',
			ephemeral: true
		};

		try {
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply(payload);
			} else {
				await interaction.reply(payload);
			}
		} catch (replyError) {
			console.log(replyError, error);
		}
	}
}

module.exports = interactionCreateHander;