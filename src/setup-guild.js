const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const util = require('./util');
const { bot_token: botToken } = require('../config.json');

/**
 * 
 * @param {Discord.Guild} guild
 */
async function setupGuild(guild) {
	// do nothing if the bot does not have the correct permissions
	if (!guild.me.permissions.has([Discord.Permissions.FLAGS.MANAGE_ROLES, Discord.Permissions.FLAGS.MANAGE_CHANNELS])) {
		console.log('Bot does not have permissions to set up in guild', guild.name);
		return;
	}

	// Setup commands
	await deployCommands(guild);

	// If anyone has a better way of doing this I'm all ears
	// names should explain what they do
	await setupCategories(guild);
	await setupVoiceChannels(guild);

	await util.updateMemberCountChannels(guild);
}

/**
 *
 * @param {Discord.Guild} guild
 */
async function deployCommands(guild) {
	const deploy = [];

	guild.client.commands.forEach(command => {
		deploy.push(command.deploy);
	});

	guild.client.contextMenus.forEach(contextMenu => {
		deploy.push(contextMenu.deploy);
	});

	const rest = new REST({ version: '10' }).setToken(botToken);

	await rest.put(Routes.applicationGuildCommands(guild.me.id, guild.id), { body: deploy });
}

/**
 * 
 * @param {Discord.Guild} guild
 */
async function setupCategories(guild) {
	await setupStatsCategory(guild);
}

/**
 * 
 * @param {Discord.Guild} guild
 */
async function setupVoiceChannels(guild) {
	await setupMembersCountChannel(guild);
	await setupPeopleCountChannel(guild);
	await setupBotsCountChannel(guild);
}


/***************************
 *                         *
 *    CATEGORY CHANNELS    *
 *                         *
 ***************************/

/**
 *
 * @param {Discord.Guild} guild
 */
async function setupStatsCategory(guild) {
	const channels = await guild.channels.fetch();
	let category = channels.find(channel => channel.type === 'GUILD_CATEGORY' && channel.name === 'stats');

	if (!category) {
		category = await guild.channels.create('stats', {
			type: 'GUILD_CATEGORY'
		});
	}

	if (category.position !== 0) {
		await category.setPosition(0);
	}
}

/************************
 *                      *
 *    VOICE CHANNELS    *
 *                      *
 ************************/

/**
 *
 * @param {Discord.Guild} guild
 */
async function setupMembersCountChannel(guild) {
	const channels = await guild.channels.fetch();
	const category = channels.find(channel => channel.type === 'GUILD_CATEGORY' && channel.name === 'stats');
	let channel = channels.find(channel => channel.type === 'GUILD_VOICE' && channel.name.startsWith('Members'));

	if (!channel) {
		channel = await guild.channels.create('Members - 0', {
			type: 'GUILD_VOICE',
		});
	}

	if (channel.parentId !== category.id) {
		await channel.setParent(category);
	}

	if (channel.position !== 0) {
		await channel.setPosition(0);
	}

	const permissionOverwrites = [{
		id: guild.roles.everyone,
		deny: [
			Discord.Permissions.FLAGS.CONNECT
		]
	}];

	await channel.permissionOverwrites.set(permissionOverwrites);
}

/**
 *
 * @param {Discord.Guild} guild
 */
async function setupPeopleCountChannel(guild) {
	const channels = await guild.channels.fetch();
	const category = channels.find(channel => channel.type === 'GUILD_CATEGORY' && channel.name === 'stats');
	let channel = channels.find(channel => channel.type === 'GUILD_VOICE' && channel.name.startsWith('People'));

	if (!channel) {
		channel = await guild.channels.create('People - 0', {
			type: 'GUILD_VOICE',
		});
	}

	if (channel.parentId !== category.id) {
		await channel.setParent(category);
	}

	if (channel.position !== 1) {
		await channel.setPosition(1);
	}

	const permissionOverwrites = [{
		id: guild.roles.everyone,
		deny: [
			Discord.Permissions.FLAGS.CONNECT
		]
	}];

	await channel.permissionOverwrites.set(permissionOverwrites);
}

/**
 *
 * @param {Discord.Guild} guild
 */
async function setupBotsCountChannel(guild) {
	const channels = await guild.channels.fetch();
	const category = channels.find(channel => channel.type === 'GUILD_CATEGORY' && channel.name === 'stats');
	let channel = channels.find(channel => channel.type === 'GUILD_VOICE' && channel.name.startsWith('Bots'));

	if (!channel) {
		channel = await guild.channels.create('Bots - 0', {
			type: 'GUILD_VOICE',
		});
	}

	if (channel.parentId !== category.id) {
		await channel.setParent(category);
	}

	if (channel.position !== 2) {
		await channel.setPosition(2);
	}

	const permissionOverwrites = [{
		id: guild.roles.everyone,
		deny: [
			Discord.Permissions.FLAGS.CONNECT
		]
	}];

	await channel.permissionOverwrites.set(permissionOverwrites);
}

module.exports = setupGuild;