import discord
import asyncio
from discord.ext.commands import Bot
from discord.ext import commands
import platform
import json
import re


# load config file, exit if not found
cfg = None

try:
    with open("config.json", "r") as cfgFile:
        cfg = json.load(cfgFile)
except FileNotFoundError:
    print('copy "config.example.json", rename it to "config.json" and edit it before running Yamamura')

if cfg:
    # load the output file
    output = open("output.log", "w")

    # get the bot
    bot = Bot(description="Yamamura by superwhiskers", command_prefix=cfg["prefix"], pm_help = cfg["pm-help"])

    # useful functions
    def server():
        for x in bot.servers:
            return x

    def channel(channel_name):
        return discord.utils.get(server().channels, name=channel_name)

    def role(role_name):
        return discord.utils.get(server().roles, name=role_name)

    def user(user_name):
        return discord.utils.get(server().members, name=user_name)

    @bot.event
    async def on_ready():

        # set server var
        for x in bot.servers:
            bot.server = x
            break

        # print some output
        print('logged in as: '+bot.user.name+' (id:'+bot.user.id+') | connected to '+str(len(bot.servers))+' server(s)')
        print('invite: https://discordapp.com/oauth2/authorize?bot_id={}&scope=bot&permissions=8'.format(bot.user.id))
        await bot.change_presence(game=discord.Game(name='with edamame'))

    # message handling
    @bot.event
    async def on_message(msg):

        # log-em.
        print("[{} in {}]: {}".format(msg.author.name, msg.channel.name, msg.content))

        # no checkin yourself
        if msg.author.name == "Yamamura™":
            return

        # voting made easy
        if (msg.channel.name == "voting") or (msg.channel.name == "voting-game-suggestions"):
            # print(msg.server.emojis[0].name)
            await bot.add_reaction(msg, u'\U0001F44D')
            await bot.add_reaction(msg, u'\U0001F44E')

        # ayyyyyyyyyyyyy...
        elif re.match(r"^ay{1,}$", msg.content, re.IGNORECASE & re.MULTILINE):
            y = ""
            for x in range(0, len(msg.content)):
                if msg.content[x] == "y":
                    y += "o"
            ret = "lma"+y
            if len(ret) > 2000:
                ret = ret[0:2000]
            await bot.send_message(msg.channel, ret)

        # do you like teapots? dun dun dun dun dunnn....
        elif "i'm a teapot" in msg.content.lower():
            await bot.add_roles(msg.author, role("Real Devs"))

        # eh ayy?
        elif "ay" in msg.content:
            if ("@everyone" in msg.content) or ("@here" in msg.content):
                await bot.send_message(msg.channel, "Coo, {}, no everyone pings in 'ayy' messages".format(msg.author.mention))
                return
            splitmsg = msg.content.split(" ")
            msgayy = None
            for x in range(0, len(splitmsg)):
                if re.match(r"^ay{1,}$", splitmsg[x], re.IGNORECASE & re.MULTILINE):
                    msgayy = splitmsg[x]
                    slot = x
                    break
            y = ""
            if msgayy == None:
                return

            for x in range(0, len(msgayy)):
                if msgayy[x] == "y":
                    y += "o"
            ret = "lma"+y

            # concatenating the message
            if slot == 0:
                fullret = ret + " " + " ".join(splitmsg[1:len(splitmsg)])

                # if the string is too long,
                if len(fullret) > 2000:

                    # i'm too lazy to implement splicing the message
                    if len(fullret) > 2000:
                        await bot.send_message(msg.channel, "Coo, {}, your message is too long.".format(msg.author.mention))
                        return

            elif slot == (len(splitmsg) - 1):
                fullret = " ".join(splitmsg[0:len(splitmsg) - 1]) + " " + ret

                # if the string is too long,
                if len(fullret) > 2000:

                    # i'm too lazy to implement splicing the message
                    if len(fullret) > 2000:
                        await bot.send_message(msg.channel, "Coo, {}, your message is too long.".format(msg.author.mention))
                        return

            else:
                fullret = splitmsg
                fullret[slot] = ret
                fullret = " ".join(fullret)

                # if the string is too long,
                if len(fullret) > 2000:

                    # i'm too lazy to implement splicing the message
                    if len(fullret) > 2000:
                        await bot.send_message(msg.channel, "Coo, {}, your message is too long.".format(msg.author.mention))
                        return

            # SEND IT ALREADY!!!
            await bot.send_message(msg.channel, fullret)


    bot.run(cfg["token"])
