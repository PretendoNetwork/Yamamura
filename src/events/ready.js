const Discord = require('discord.js');
const glob = require('glob');
const path = require('path');
const setupGuild = require('../setup-guild');

/**
 * 
 * @param {Discord.Client} client
 */
async function readyHandler(client) {
	loadBotHandlersCollection('buttons', client.buttons);
	loadBotHandlersCollection('commands', client.commands);
	loadBotHandlersCollection('context-menus', client.contextMenus);
	loadBotHandlersCollection('modals', client.modals);
	loadBotHandlersCollection('select-menus', client.selectMenus);

	const guilds = await client.guilds.fetch();

	for (let guild of guilds) {
		guild = await guild[1].fetch();
		await setupGuild(guild);
	}

	console.log(`Logged in as ${client.user.tag}!`);
}

/**
 *
 * @param {String} name
 * @param {Discord.Collection} collection
 */
function loadBotHandlersCollection(name, collection) {
	const files = glob.sync(`${__dirname}/../${name}/**/*.js`);

	for (const file of files) {
		const handler = require(path.resolve(file));

		collection.set(handler.name, handler);
	}
}

module.exports = readyHandler;