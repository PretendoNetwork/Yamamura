import discord
import asyncio
from discord.ext.commands import Bot
from discord.ext import commands
import platform
import json
import re

# load the access token
cfg = json.load(open("config.json", "r"))

# get the bot
bot = Bot(description="Yamamura by superwhiskers", command_prefix=cfg["prefix"], pm_help = cfg["pm-help"])
channels = { }
roles = { }

@bot.event
async def on_ready():

    # set server var
    for x in bot.servers:
        bot.server = x
        break

    # print some output
    print('logged in as: '+bot.user.name+' (id:'+bot.user.id+') | connected to '+str(len(bot.servers))+' server(s)')
    print('invite: https://discordapp.com/oauth2/authorize?bot_id={}&scope=bot&permissions=8'.format(bot.user.id))
    return await bot.change_presence(game=discord.Game(name='with edamame'))

    # get some roles
    roles["developer"] = discord.utils.get(bot.server.roles, name="Developer")
    roles["realerdev"] = discord.utils.get(bot.server.roles, name="Realer Devs")
    roles["partner"] = discord.utils.get(bot.server.roles, name="Partner")
    roles["realdev"] = discord.utils.get(bot.server.roles, name="Real Devs")
    roles["updates"] = discord.utils.get(bot.server.roles, name="Updates")
    roles["everyone"] = bot.server.default_role

    # get the channels
    channels["welcomes"] = discord.utils.get(bot.server.channels, name="welcomes")
    channels["rules"] = discord.utils.get(bot.server.channels, name="rules")
    channels["general"] = discord.utils.get(bot.server.channels, name="general")
    channels["announcements"] = discord.utils.get(bot.server.channels, name="announcements")
    channels["support"] = discord.utils.get(bot.server.channels, name="support")
    channels["offtopic"] = discord.utils.get(bot.server.channels, name="offtopic")
    channels["gitupdates"] = discord.utils.get(bot.server.channels, name="git-updates")
    channels["generaldev"] = discord.utils.get(bot.server.channels, name="general-dev")
    channels["memes"] = discord.utils.get(bot.server.channels, name="memes")
    channels["botspam"] = discord.utils.get(bot.server.channels, name="botspam")
    channels["cotrd"] = discord.utils.get(bot.server.channels, name="cult-of-the-real-devs")
    channels["services-general"] = discord.utils.get(bot.server.channels, name="general-services")
    channels["oauth"] = discord.utils.get(bot.server.channels, name="oauth")
    channels["prudp"] = discord.utils.get(bot.server.channels, name="prudp")
    channels["cors"] = discord.utils.get(bot.server.channels, name="cors")
    channels["voting"] = discord.utils.get(bot.server.channels, name="voting")
    channels["voting-gs"] = discord.utils.get(bot.server.channels, name="voting-game-suggestions")
    channels["dev-general"] = discord.utils.get(bot.server.channels, name="general-developer")
    channels["dev"] = discord.utils.get(bot.server.channels, name="dev")
    channels["thesituationroom"] = discord.utils.get(bot.server.channels, name="the-situation-room")

# message handling
@bot.event
async def on_message(msg):
    if (msg.channel.name == "voting") or (msg.channel.name == "voting-game-suggestions"):
        # print(msg.server.emojis[0].name)
        await bot.add_reaction(msg, u'\U0001F44D')
        await bot.add_reaction(msg, u'\U0001F44E')
    elif re.match(r"^ay{1,}", msg.content, re.IGNORECASE & re.MULTILINE):
        y = ""
        for x in range(0, len(msg.content)):
            if msg.content[x] == "y":
                y += "o"
        await bot.send_message(msg.channel, "lma"+y)
    elif "i'm a teapot" in msg.content.lower():
        await bot.add_roles(msg.author, roles["realdev"])

bot.run(cfg["token"])
