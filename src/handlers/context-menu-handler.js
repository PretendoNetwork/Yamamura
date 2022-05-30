const Discord = require('discord.js');

/**
 * 
 * @param {Discord.ContextMenuInteraction} interaction
 */
async function contextMenuHandler(interaction) {
	const { commandName } = interaction;

	/** @type {Discord.Collection} */
	const contextMenus = interaction.client.contextMenus;
	const contextMenu = contextMenus.get(commandName);

	// do nothing if no contextMenu
	if (!contextMenu) {
		throw new Error(`Missing context menu handler for \`${commandName}\``);
	}

	// run the contextMenu
	await contextMenu.handler(interaction);
}

module.exports = contextMenuHandler;