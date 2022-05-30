const Discord = require('discord.js');

/**
 * 
 * @param {Discord.SelectMenuInteraction} interaction
 */
async function selectMenuHandler(interaction) {
	const { customId } = interaction;

	/** @type {Discord.Collection} */
	const selectMenus = interaction.client.selectMenus;
	const selectMenu = selectMenus.get(customId);

	// do nothing if no selectMenu
	if (!selectMenu) {
		throw new Error(`Missing select menu handler for \`${customId}\``);
	}

	// run the selectMenu
	await selectMenu.handler(interaction);
}

module.exports = selectMenuHandler;