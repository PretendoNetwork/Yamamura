const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const util = require("./util");
const { bot_token: botToken, application_id: applicationId } = require("../config.json");
const rest = new REST({ version: "10" }).setToken(botToken);

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
  await deployCommandsToGuild(guild);
  
  try {
    await util.updateMemberCountChannels(guild);
  } catch {
    // we dont care if it fails on setup, itll sync again on join
  }
}

/**
 *
 * @param {Discord.Guild} guild
 */
async function deployCommandsToGuild(guild) {
  const deploy = [];

  guild.client.commands.forEach((command) => {
    deploy.push(command.deploy);
  });

  guild.client.contextMenus.forEach((contextMenu) => {
    deploy.push(contextMenu.deploy);
  });


  await rest.put(Routes.applicationGuildCommands(guild.me.id, guild.id), {
    body: deploy,
  });
}

async function deployCommands(client) {
  const deploy = [];

  client.commands.forEach((command) => {
    deploy.push(command.deploy);
  });

  client.contextMenus.forEach((contextMenu) => {
    deploy.push(contextMenu.deploy);
  });

  await rest.put(Routes.applicationCommands(applicationId), {
    body: deploy,
  });
}

module.exports = {
  setupGuild,
  deployCommands,
};
