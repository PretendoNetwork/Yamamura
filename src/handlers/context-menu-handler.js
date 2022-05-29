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
		interaction.reply(`Missing context menu handler for \`${commandName}\``);
		return;
	}

	// run the contextMenu
	contextMenu.handler(interaction);
}

module.exports = contextMenuHandler;