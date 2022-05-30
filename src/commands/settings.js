const Discord = require('discord.js');
const db = require('../db');
const { guild_id } = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

const editableOptions = [
  "mod-applications.channel.log",
  "report.channel.log",
  "joinmsg.channels.readme",
  "joinmsg.channels.rules",
  "stats.channels.members",
  "stats.channels.people",
  "stats.channels.bots",
]

async function isValidkey(interaction) {
  const key = interaction.options.getString("key");
  if (!editableOptions.includes(key)) {
    await interaction.reply({
      content: "Cannot edit this setting - not a valid setting",
      ephemeral: true,
    })
    return false;
  }
  return true;
}

/**
 *
 * @param {Discord.CommandInteraction} interaction
 */
async function settingsHandler(interaction) {
  if (interaction.guildId !== guild_id) {
    await interaction.reply({
      content: "Cannot edit this setting - this guild is not whitelisted",
      ephemeral: true,
    })
    return;
  }

  const key = interaction.options.getString("key");
	if (interaction.options.getSubcommand() === "get") {
    if (!await isValidkey(interaction))
      return;
    // this is hellish string concatenation, I know
    await interaction.reply({
      content: "```\n" + key + "=" + '"' + `${db.getDB().get(key)}` +'"' + "\n```",
      ephemeral: true,
      allowedMentions: {
        parse: [], // dont allow tagging anything
      }
    })
    return; 
  }

	if (interaction.options.getSubcommand() === "set") {
    if (!await isValidkey(interaction))
      return;
    db.getDB().set(key, interaction.options.getString("value"))
    await interaction.reply({
      content: `setting \`${key}\` has been saved successfully`,
      ephemeral: true,
      allowedMentions: {
        parse: [], // dont allow tagging anything
      }
    })
    return; 
  }

	if (interaction.options.getSubcommand() === "which") {
    await interaction.reply({
      content: `**possible settings**:\n${editableOptions.map(v=>`\`${v}\``).join("\n")}`,
      ephemeral: true,
      allowedMentions: {
        parse: [], // dont allow tagging anything
      }
    })
    return; 
  }

  throw new Error("unhandled subcommand");
}

const command = new SlashCommandBuilder();

command.setDefaultPermission(false);
command.setName('settings');
command.setDescription('Setup the bot');
command.addSubcommand(cmd => {
  cmd.setName("set");
  cmd.setDescription("Change a settings key");
  cmd.addStringOption(option => {
    option.setName('key');
    option.setDescription('Key to modify');
    option.setRequired(true); 
    return option;
  });
  cmd.addStringOption(option => {
    option.setName('value');
    option.setDescription('value to set the setting to');
    option.setRequired(true); 
    return option;
  });
  return cmd;
})
command.addSubcommand(cmd => {
  cmd.setName("get");
  cmd.setDescription("Get value of settings key");
  cmd.addStringOption(option => {
    option.setName('key');
    option.setDescription('Key to modify');
    option.setRequired(true); 
    return option;
  });
  return cmd;
})
command.addSubcommand(cmd => {
  cmd.setName("which");
  cmd.setDescription("which settings are valid?");
  return cmd;
})

module.exports = {
	name: command.name,
	help: 'Change settings of the bot',
	handler: settingsHandler,
	deploy: command.toJSON()
};
