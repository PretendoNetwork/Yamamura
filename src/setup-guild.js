const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const util = require("./util");
const { bot_token: botToken } = require("../config.json");

/**
 *
 * @param {Discord.Guild} guild
 */
async function setupGuild(guild) {
  // do nothing if the bot does not have the correct permissions
  if (!guild.me.permissions.has([Discord.Permissions.FLAGS.MANAGE_CHANNELS])) {
    console.log("Bot does not have permissions to set up in guild", guild.name);
    return;
  }

  // Setup commands
  await deployCommands(guild);
  
  try {
    await util.updateMemberCountChannels(guild);
  } catch {
    // we dont care if it fails on setup
  }
}

/**
 *
 * @param {Discord.Guild} guild
 */
async function deployCommands(guild) {
  const deploy = [];

  guild.client.commands.forEach((command) => {
    deploy.push(command.deploy);
  });

  guild.client.contextMenus.forEach((contextMenu) => {
    deploy.push(contextMenu.deploy);
  });

  const rest = new REST({ version: "10" }).setToken(botToken);

  await rest.put(Routes.applicationGuildCommands(guild.me.id, guild.id), {
    body: deploy,
  });
}

module.exports = setupGuild;
