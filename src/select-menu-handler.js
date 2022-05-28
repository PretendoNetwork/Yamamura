const Discord = require('discord.js');
const selectMenus = require('./select-menus-manager');

/**
 * 
 * @param {Discord.SelectMenuInteraction} interaction
 */
async function selectMenuHandler(interaction) {
	const { customId } = interaction;

	// do nothing if no select menu
	if (!selectMenus[customId]) {
		interaction.reply(`Missing select menu handler for \`${customId}\``);
		return;
	}

	// run the select menu
	selectMenus[customId].handler(interaction);
}

module.exports = selectMenuHandler;