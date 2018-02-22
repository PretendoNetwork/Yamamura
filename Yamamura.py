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

# help msg
helpmsg = f"""```
Yamamura™, the Pretendo Discord bot

{cfg["prefix"]}help          : Shows this message
{cfg["prefix"]}toggleupdates : Toggles the Updates role
{cfg["prefix"]}authors       : Shows the authors of the bot```"""

# author message
authors = """```
superwhiskers (@!superwhiskers™#3210) : bot concept and main developer
Netux         (@Netux#2308)           : certain features and some regex work```"""

if cfg:
    # get the bot
    bot = Bot(description="Yamamura by superwhiskers", command_prefix=cfg["prefix"], pm_help = cfg["pm-help"])

    # useful functions
    def log(string):
        print(string)
        with open("output.log", "a") as output:
            output.write(string + "\n")

    # returns the server the bot is in
    def server():
        for x in bot.servers:
            return x

    # return a channel object by name
    def channel(channel_name):
        return discord.utils.get(server().channels, name=channel_name)

    # returns a role object by name
    def role(role_name):
        return discord.utils.get(server().roles, name=role_name)

    # returns a user object by name
    def user(user_name):
        return discord.utils.get(server().members, name=user_name)

    # checks if a command is at the start of a message
    def command(command, msg):
        return re.match(r"^"+cfg["prefix"]+command, msg, re.MULTILINE)

    # checks if the specified member has a role
    def hasRole(member, role):
        hasRole = False
        for x in range(0, len(member.roles)):
            if role == member.roles[x].name:
                hasRole = True
        return hasRole

    @bot.event
    async def on_ready():

        # set server var
        for x in bot.servers:
            bot.server = x
            break

        # print some output
        print(f"logged in as: { bot.user.name } (id:{ bot.user.id }) | connected to { str(len(bot.servers)) } server(s)")
        print(f"invite: https://discordapp.com/oauth2/authorize?bot_id={ bot.user.id }&scope=bot&permissions=8")
        await bot.change_presence(game=discord.Game(name='with edamame'))

    # message handling
    @bot.event
    async def on_message(msg):

        # log-em.
        log(f"[{ msg.author.name } in { msg.channel.name }] { msg.content }")

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
            if hasRole(msg.author, "Real Devs"):
                await bot.remove_roles(msg.author, role("Real Devs"))
                await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, you no longer have the Real Devs role.")
            else:
                await bot.add_roles(msg.author, role("Real Devs"))
                await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, you now have the Real Devs role.")
            await bot.delete_message(msg)

        # eh ayy?
        elif "ay" in msg.content:

            if ("@everyone" in msg.content) or ("@here" in msg.content):
                await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, no everyone pings in 'ayy' messages")
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
            fullret = splitmsg
            fullret[slot] = ret
            fullret = " ".join(fullret)

            # if the string is too long,
            if len(fullret) > 2000:

                # i'm too lazy to implement splicing the message
                if len(fullret) > 2000:
                    await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, your message is too long.")
                    return

            # SEND IT ALREADY!!!
            await bot.send_message(msg.channel, fullret)

        # if the first character is the prefix
        elif msg.content[0] == cfg["prefix"]:

            # prefix + help
            if command("help", msg.content):
                await bot.send_message(msg.author, helpmsg)

            # prefix + remindme
            elif command("toggleupdates", msg.content):
                if hasRole(msg.author, "Updates"):
                    await bot.remove_roles(msg.author, role("Updates"))
                    await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, you no longer have the Updates role.")
                else:
                    await bot.add_roles(msg.author, role("Updates"))
                    await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, you now have the Updates role.")

            # prefix + authors
            elif command("authors", msg.content):
                await bot.send_message(msg.author, authors)



    bot.run(cfg["token"])
