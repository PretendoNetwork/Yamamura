const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { bot_token: botToken } = require('../config.json');
const commands = require('./commands-manager');
const util = require('./util');

const rest = new REST({ version: '10' }).setToken(botToken);

const commandsDeploy = Object.keys(commands).map(name => commands[name].deploy);

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
	await setupTextChannels(guild);
	await setupVoiceChannels(guild);
	

	await util.updateMemberCountChannels(guild);
}

/**
 *
 * @param {Discord.Guild} guild
 */
async function deployCommands(guild) {
	await rest.put(Routes.applicationGuildCommands(guild.me.id, guild.id), { body: commandsDeploy });
}

/**
 * 
 * @param {Discord.Guild} guild
 */
async function setupCategories(guild) {
	await setupStatsCategory(guild);
	await setupPretendoCategory(guild);
	await setupModeratorCategory(guild);
}

/**
 * 
 * @param {Discord.Guild} guild
 */
async function setupTextChannels(guild) {
	await setupReadmeChannel(guild);
	await setupRulesChannel(guild);
	await setupModApplicationsChannel(guild);
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

/**
 *
 * @param {Discord.Guild} guild
 */
async function setupPretendoCategory(guild) {
	const channels = await guild.channels.fetch();
	const category = channels.find(channel => channel.type === 'GUILD_CATEGORY' && channel.name === 'pretendo');

	if (!category) {
		await guild.channels.create('pretendo', {
			type: 'GUILD_CATEGORY'
		});
	}
}

/**
 *
 * @param {Discord.Guild} guild
 */
async function setupModeratorCategory(guild) {
	const channels = await guild.channels.fetch();
	let category = channels.find(channel => channel.type === 'GUILD_CATEGORY' && channel.name === 'moderator');

	if (!category) {
		category = await guild.channels.create('moderator', {
			type: 'GUILD_CATEGORY'
		});
	}

	const roles = await guild.roles.fetch();
	const permissionOverwrites = [{
		id: guild.roles.everyone,
		deny: Discord.Permissions.ALL
	}];

	roles.forEach(role => {
		if (role.permissions.has(Discord.Permissions.FLAGS.MODERATE_MEMBERS)) {
			permissionOverwrites.push({
				type: 'role',
				id: role.id,
				allow: Discord.Permissions.ALL
			});
		}
	});

	await category.permissionOverwrites.set(permissionOverwrites);
}

/***********************
 *                     *
 *    TEXT CHANNELS    *
 *                     *
 ***********************/

/**
 *
 * @param {Discord.Guild} guild
 */
async function setupReadmeChannel(guild) {
	const channels = await guild.channels.fetch();
	const category = channels.find(channel => channel.type === 'GUILD_CATEGORY' && channel.name === 'pretendo');
	let channel = channels.find(channel => channel.type === 'GUILD_TEXT' && channel.name === 'readme');

	if (!channel) {
		channel = await guild.channels.create('readme', {
			type: 'GUILD_TEXT'
		});
	}

	if (channel.parentId !== category.id) {
		await channel.setParent(category);
	}

	const permissionOverwrites = [{
		id: guild.roles.everyone,
		allow: [
			Discord.Permissions.FLAGS.VIEW_CHANNEL
		],
		deny: [
			Discord.Permissions.FLAGS.SEND_MESSAGES
		]
	}];

	await channel.permissionOverwrites.set(permissionOverwrites);

	const messages = await channel.messages.fetch();
	let botMessages = messages.filter(message => message.author.id === guild.me.id);
	botMessages = botMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

	const socialMediaEmbed = new Discord.MessageEmbed();
	socialMediaEmbed.setTitle(':desktop: Social Media');
	socialMediaEmbed.setDescription('Where to find us online');
	socialMediaEmbed.setColor(0x1B1F3B);
	socialMediaEmbed.setFields([
		{
			'name': ':globe_with_meridians: Website',
			'value': 'https://pretendo.network'
		},
		{
			'name': '<:git:415206315703533569> GitHub',
			'value': 'https://github.com/PretendoNetwork'
		},
		{
			'name': '<:patreonlogo:886254233786138635> Patreon',
			'value': 'https://patreon.com/PretendoNetwork'
		},
		{
			'name': '<:twitterlogo:886254233962291241> Twitter',
			'value': 'https://twitter.com/PretendoNetwork'
		},
		{
			'name': '<:twitchlogo:886254234201362473> Twitch',
			'value': 'https://twitch.tv/PretendoNetwork'
		},
		{
			'name': '<:youtubelogo:886254234226528337> YouTube',
			'value': 'https://youtube.com/c/PretendoNetwork'
		}
	]);

	const introductionEmbed = new Discord.MessageEmbed();
	introductionEmbed.setTitle(':wave: Introduction');
	introductionEmbed.setDescription('Information about the project');
	introductionEmbed.setColor(0x1B1F3B);
	introductionEmbed.setThumbnail('https://i.imgur.com/8clyKqx.png');
	introductionEmbed.setImage('https://i.imgur.com/CF7qgW1.png');
	introductionEmbed.setFields([
		{
			'name': 'What is this place?',
			'value': '_Pretendo Network_ is a free, open-source, Nintendo Network replacement for the Wii U and 3DS family of consoles'
		},
		{
			'name': 'How can I use Pretendo?',
			'value': 'At the moment Pretendo is in closed beta. The servers are too unstable for mass use for long periods of time, though we do open the servers up to the public for stress testing and special events for short periods of time. Official testers also have access to the beta servers',
			'inline': true
		},
		{
			'name': 'Can I become an official tester?',
			'value': 'Yes! There are 2 main ways to become a tester:\n\n- A developer may select a community member for any reason to become a tester for any period of time. These people are chosen at the developers discretion and there are no set rules to be picked\n- A donation to the projects Patreon will grant you access to the closed beta. You will also have access to beta servers even after the public release to test new features sooner. A donation also gives you read-only access to select development channels',
			'inline': true
		},
		{
			'name': 'Is there an ETA for the public release?',
			'value': 'No. Due to the size and complexity of the project it is difficult to give an exact ETA. Every day we find new issues to fix, new features to add, and new discoveries which need research. All of these things bring drive the ETA further and further back. To best keep up with progress check out the #github and #announcements-updates channels as well as the progress page on our website, https://pretendo.network/progress. You may also assign yourself the `@updates` role to be notified of updates'
		},
		{
			'name': 'Why is development slow/Why have there been no updates recently?',
			'value': 'Development may seem slow but we are almost always hard at work working on some feature for the network. Whether that be spending some time just researching and testing, only pushing out bug fixes, or simply working on the bots, just because no new major feature updates happen does not mean work is not being done. Pretendo is being worked on by a very small team of volunteers in our free time. If you would like to help make Pretendo development a full time job consider donating to the projects Patreon'
		},
		{
			'name': 'Does Pretendo support emulators?',
			'value': 'Pretendo supports any client that can interact with Nintendo Network. Currently the only emulator with this kind of functionality is Cemu. Cemu does work somewhat but is not considered stable by any means. In order to use Cemu you must obtain console dumps and use this patch https://github.com/PretendoNetwork/cemu-patcher to connect to Pretendo. Your mileage may vary, and we do not provide official support for this at this time. Cemu also does not provide official support for Pretendo. _**Do not ask the Cemu developers, or anyone else in the Cemu community, for support regarding Pretendo**_\n\nCitra does not support true online play and thus does not work with Pretendo, and does not show signs of supporting true online play at all. Mikage, a 3DS emulator for mobile devices, may provide support in the future though this is far from certain',
			'inline': true
		},
		{
			'name': 'Will Pretendo support the Wii/Switch?',
			'value': 'The Wii already has custom servers provided by https://wiimmfi.de/\n\nWe currently have no plans to support the Switch. Many first-party Switch games _do_ use the same server software as used on the Wii U and 3DS, however we do not wish to bring negative attention to ourselves from Nintendo or the community by providing a free alternative to Nintendo\'s paid online servers on their flagship console. And after the backlash Yuzu/Rapture Network received for trying to provide such a service, it is unlikely we ever will. Nintendo is also moving away from the old server software in newer first-party titles and thus they would be unsupported by Pretendo anyway',
			'inline': true
		},
		{
			'name': 'Will Pretendo support Miiverse',
			'value': 'We already do! Juxtaposition, or Juxt for short, is the Pretendo Miiverse revival. We do not call it a clone, as Juxt aims to not recreate Miiverse 1:1 in terms of features and look, but instead reimagine Miiverse as if it were being made for a modern system. All the original Miiverse features such as friends, communities, and in-game features will still exist, along with new fresh additions exclusive to Juxt sporting a brand-new custom UI for the original Miiverse title giving it a fresh, modern, yet familiar feeling'
		}
	]);

	const message1Content = {
		content: 'Welcome to the Pretendo Network server :smile:\n\nBefore you continue please read this channel completely. It contains all the information needed to ensure you, and your fellow community members, have a good and civilized time. Thank you for joining!\n\nDiscord invite:  https://invite.gg/pretendo\n\n',
		embeds: [socialMediaEmbed, introductionEmbed]
	};

	const message1 = botMessages.at(0);

	if (!message1) {
		await channel.send(message1Content);
	} else {
		// TODO: Check if old message equals current message data?
		await message1.edit(message1Content);
	}

	const rolesEmbed = new Discord.MessageEmbed();
	rolesEmbed.setTitle('Roles');
	rolesEmbed.setDescription('The server roles and their meanings');
	rolesEmbed.setColor(0x1B1F3B);
	rolesEmbed.setFields([
		{
			'name': 'Owners',
			'value': '@Owner - Members with this role either own the server or are original founders of Pretendo, most of the time both. Currently only 2 owners exist, however some high-ranking admins may have the role temporarily to perform certain tasks otherwise impossible'
		},
		{
			'name': 'Developers',
			'value': '@Developer - A person who has provided work to Pretendo in some significant way. Members with this role include official team members, people who contribute to the core libraries of the project, people who have provided guidance or information about important topics, or outside developers whom we wish to discuss things privately with in regards to Pretendo\n\n@Senior Dev 👴 - Members with this role have been developers since the near beginning of the project and contributed much of the original core codebase. These members likely have the most knowledge of the Pretendo project itself as well as Nintendo Network as a whole\n\n@WiiU - This role indicates that the developer works on titles and servers for the Wii U\n\n@3DS - This role indicates that the developer works on titles and servers for the 3DS family of consoles\n\n@Miiverse - This role indicates that the developer works on servers for Miiverse\n\n@Web Developer - Members with this role have contributed to the development and maintaining of the Pretendo website'
		},
		{
			'name': 'Developers 2',
			'value': '@Designer - Members with this role have contributed official design work for Pretendo. This can be anything from web design to official art for SplatFest\'s\n\n@Splatfest Developer - This role indicates that the developer works on servers for Splatoon SplatFests\n\n@Patch Developer - This role indicates that the developer works on the Cemu Pretendo patch\n\n@Shares Dumps - This is a special role indicating the user shares network dumps containing traffic from online of some titles for some consoles. This role is only given out to very few trusted people, not even all devs have this role, due to the network traffic possibly containing sensitive information like passwords, IP addresses or other identifying information'
		},
		{
			'name': 'Partners/Testers',
			'value': '@Partner - Members with this role are partners of the project but are not directly affiliated with it\'s core development. Examples include Rverse, a different Miiverse clone whose aim is to recreate Miiverse as it originally was and whom we share information back and forth with\n\n@Tester - Members with this role are official testers. They have access to the beta servers which have in-testing features not yet ready for the general public. These include testers hand-picked by the development team as well as Patreon donors'
		},
		{
			'name': 'Supporters',
			'value': '@Supporter - Members with this role have supported Pretendo through donations either through Ko-Fi or Patreon\n\n@Supporter - Star Power - This role indicates that the supported donated to the Star Power tier on Patreon\n\n@Supporter - Mega Mushroom - This role indicates that the supported donated to the Mega Mushroom tier on Patreon\n\n@Supporter - Super Mario - This role indicates that the supported donated to the Super Mario tier on Patreon\n\n@Supporter - Mario - This role indicates that the supported donated to the Mario tier on Patreon'
		},
		{
			'name': 'Moderation',
			'value': '@Admin - Members with this role are server administrators. They have higher permissions than regular moderators\n\n@Moderator - Members with this role help moderate the server to make sure the rules are being followed\n\n@Muted - Members with this role cannot send messages in any channel\n\n@NSFW Punished - Members with this role have been suspected of sending NSFW content in the server and have been locked to a single channel'
		},
		{
			'name': 'Community',
			'value': '@Updates - Members with this role get pinged whenever important server announcements happen\n\n@StreamPing - Members with this role get pinged whenever a new Twitch stream is beginning\n\n@Translator - Members with this role have helped with translating parts of Pretendo, mostly the website, but are not full-fledged developers'
		},
		{
			'name': 'Misc',
			'value': '@Bot - Role given to all bots\n\n@beep boop - Role given to all bots\n\n@Ko-fi Bot - Role for the Ko-Fi bot\n\n@Patreon - Role for the Patreon bot\n\n@INVITE.GG - Role for the invite.gg bot\n\n@Yamamura - Role for Yamamura\n\n@Chubby - Role for Chubby'
		}
	]);

	const botsEmbed = new Discord.MessageEmbed();
	botsEmbed.setTitle('Bots');
	botsEmbed.setDescription('The bots and what they do');
	botsEmbed.setColor(0x1B1F3B);
	botsEmbed.setFields([
		{
			'name': '<:yamamura:416804930838331402> Yamamura',
			'value': 'Hey that\'s me! I\'m Yamamura, the community helper bot! My job is to help interact with the community in useful ways and make everyone\'s stay here a little bit funner. I provide information about Pretendo as well as several /commands to help you along the way'
		},
		{
			'name': '<:chubby:909396252167389265> Chubby',
			'value': 'My good friend Chubby is pretty serious. His job is to be used by the moderation team and developers to enforce the rules of the server. He provides several /commands to issue things such as warnings, kicks and bans'
		}
	]);

	const message2Content = { embeds: [rolesEmbed, botsEmbed] };

	const message2 = botMessages.at(1);

	if (!message2) {
		await channel.send(message2Content);
	} else {
		// TODO: Check if old message equals current message data?
		await message2.edit(message2Content);
	}
}

/**
 *
 * @param {Discord.Guild} guild
 */
async function setupRulesChannel(guild) {
	const channels = await guild.channels.fetch();
	const category = channels.find(channel => channel.type === 'GUILD_CATEGORY' && channel.name === 'pretendo');
	let channel = channels.find(channel => channel.type === 'GUILD_TEXT' && channel.name === 'rules');

	if (!channel) {
		channel = await guild.channels.create('rules', {
			type: 'GUILD_TEXT',
			permissionOverwrites: [
				{
					id: guild.roles.everyone,
					allow: [
						Discord.Permissions.FLAGS.VIEW_CHANNEL
					],
					deny: [
						Discord.Permissions.FLAGS.SEND_MESSAGES
					]
				}
			]
		});
	}

	if (channel.parentId !== category.id) {
		await channel.setParent(category);
	}

	const messages = await channel.messages.fetch();
	let botMessages = messages.filter(message => message.author.id === guild.me.id);
	botMessages = botMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

	const rulesEmbed = new Discord.MessageEmbed();
	rulesEmbed.setTitle('Rules');
	rulesEmbed.setDescription('Rules of the server. Once they have been read, use the `/verify` command to verify you have read the rules');
	rulesEmbed.setColor(0x1B1F3B);
	rulesEmbed.setFields([
		{
			'name': '1: Be nice',
			'value': 'Treat everyone with respect. Absolutely no harassment, witch hunting, sexism, racism, or hate speech, etc, will be tolerated.'
		},
		{
			'name': '2: Family friendly',
			'value': 'No NSFW or obscene content. This includes text, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content. Swearing and other strong language is allowed as long as it is not over used or used in a way to insult/harm others'
		},
		{
			'name': '3: No spam',
			'value': 'No spam or self-promotion (server invites, advertisements, etc) without permission from a developer/staff member, unless otherwise allowed by the channel.'
		},
		{
			'name': '4: Respect channel topics',
			'value': 'Keep all conversations relevant to the channel topic. Spam, memes, offtopic discussions, etc should not be happening outside their respective channels.'
		},
		{
			'name': '5: No piracy',
			'value': 'Do not share anything illegal. This includes game/firmware dumps, any console SDK, etc. If it feels illegal, it probably is. If you aren\'t sure, don\'t share it. Do not share downloads or links to tools which promote piracy. Do not discuss piracy or offer to help with piracy'
		},
		{
			'name': '6: No unsolicited DMs',
			'value': 'Don\'t DM the Developers unless absolutely necessary.'
		},
		{
			'name': '7: Punishments',
			'value': 'Staff are free to delivery punishments as they see fit. If you believe you were punished incorrectly, contact another staff member or developer.'
		}
	]);

	const messageContent = { embeds: [rulesEmbed] };

	const message = botMessages.at(0);

	if (!message) {
		await channel.send(messageContent);
	} else {
		// TODO: Check if old message equals current message data?
		await message.edit(messageContent);
	}
}

/**
 *
 * @param {Discord.Guild} guild
 */
async function setupModApplicationsChannel(guild) {
	const channels = await guild.channels.fetch();
	const category = channels.find(channel => channel.type === 'GUILD_CATEGORY' && channel.name === 'moderator');
	let channel = channels.find(channel => channel.type === 'GUILD_TEXT' && channel.name === 'mod-applications');

	if (!channel) {
		channel = await guild.channels.create('mod-applications', {
			type: 'GUILD_TEXT',
		});
	}

	if (channel.parentId !== category.id) {
		await channel.setParent(category);
	}

	const roles = await guild.roles.fetch();
	const permissionOverwrites = [{
		id: guild.roles.everyone,
		deny: Discord.Permissions.ALL
	}];

	roles.forEach(role => {
		if (role.permissions.has(Discord.Permissions.FLAGS.MODERATE_MEMBERS)) {
			permissionOverwrites.push({
				type: 'role',
				id: role.id,
				allow: Discord.Permissions.ALL
			});
		}
	});

	await channel.permissionOverwrites.set(permissionOverwrites);
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