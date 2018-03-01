from discord.ext.commands import Bot
from discord.ext import commands
from time import gmtime, strftime
import platform
import discord
import asyncio
import time
import json
import re

# load config file, exit if not found
cfg = None

try:
    with open("config.json", "r") as cfgFile:
        cfg = json.load(cfgFile)
except FileNotFoundError:
    print('copy "config.example.json", rename it to "config.json" and edit it before running Yamamura')

# check if the modmail file exists
with open("modmail.json", "a+") as mailfile:
    mailfile.seek(0)
    if mailfile.read() == "":
        mailfile.write("[]")

# help msg
helpmsg = f"""```
Yamamura™, the Pretendo Discord bot

General:
    {cfg["prefix"]}help             : Shows this message
    {cfg["prefix"]}toggleupdates    : Toggles the Updates role
    {cfg["prefix"]}authors          : Shows the authors of the bot
Mail:
    {cfg["prefix"]}mail send <msg>  : Send a message to the mods with msg as message
    {cfg["prefix"]}mail compose     : Send a message to the mods in-dms (private)
    {cfg["prefix"]}mail read        : Read mail (mods only)
    {cfg["prefix"]}mail readid <id> : Read mail by id (mods only)
    {cfg["prefix"]}mail all         : Read all mail (mods only)
    {cfg["prefix"]}mail clean       : Clean mail read by all mods (mods only)
    {cfg["prefix"]}mail delete <id> : Delete mail by id (mods only)```"""

# author message
authors = """```
superwhiskers (@!superwhiskers™#3210) : bot concept and main developer
Netux         (@Netux#2308)           : certain features and some regex work```"""

# currently composing people
composing = []
try:
    if cfg:
        # get the bot
        bot = Bot(description="Yamamura by superwhiskers", command_prefix=cfg["prefix"])

        # useful functions

        # log to the message log
        def log(string):
            print(string)
            with open("output.log", "a") as output:
                output.write(string + "\n")

        # parse modmail to text
        def parseMail(mail):

            # parse a list of mail
            if type(mail) == list:

                # the string to send to Discord
                retstr = """Mail:
"""

                # loop through the mail list
                for x in range(0, len(mail)):

                    # append the parsed message to the string
                    retstr += f"""
{mail[x]["id"]} - Sent by {mail[x]["sender"]}```
{mail[x]["message"]}```
"""

                # return the string
                return retstr

            # parse only a single message
            else:

                # the string to send to Discord
                retstr = f"""
{mail["id"]} - Sent by {mail["sender"]}```
{mail["message"]}```

"""

                # return the parsed message
                return retstr

        # get the current modmail
        def readmail(mod):

            # the current mail
            mail = None

            # open the modmail file
            with open("modmail.json", "r") as mailfile:
                mail = json.load(mailfile)

            # the unread mail list
            unread = []

            # add all of the unread mail
            for x in mail:
                try:
                    x["readBy"].index(mod)
                except ValueError:
                    unread.append(x)
                    x["readBy"].append(mod)

            # if no mail is unread
            if unread == []:
                return None

            # write the readby
            with open("modmail.json", "w") as mailfile:
                mailfile.seek(0)
                mailfile.write(json.dumps(mail))
                mailfile.truncate()

            # return the unread mail
            return parseMail(unread)

        # send modmail
        def sendmail(message, sender):

            # the current mail
            mail = None

            # open the modmail file
            with open("modmail.json", "r") as mailfile:
                 mail = json.load(mailfile)

            # constructed mail
            mailToSend = {}

            # construct the message
            mailToSend["id"] = str(hash(time.time()))
            mailToSend["sender"] = sender
            mailToSend["message"] = message
            mailToSend["readBy"] = []

            # send the message
            mail.append(mailToSend)

            # write the mail
            with open("modmail.json", "w") as mailfile:
                mailfile.seek(0)
                mailfile.write(json.dumps(mail))
                mailfile.truncate()

            return "written"

        # clean mail
        def cleanmail(mods):

            # the current mail
            mail = None

            # open the modmail file
            with open("modmail.json", "r") as mailfile:
                mail = json.load(mailfile)

            # indexes of mail to delete
            indexesToDelete = []

            # check if all the mods have read the mail
            for x in mail:
                mailRead = True
                for y in range(0, len(mods)):
                    try:
                        x["readBy"].index(mods[y])
                    except ValueError:
                        mailRead = False
                if mailRead == True:
                    indexesToDelete.append(mail.index(x))

            # then clean from the mail list the indexes to delete
            for x in range(0, len(indexesToDelete)):
                del mail[indexesToDelete[x]]

            # then save the file
            with open("modmail.json", "w") as mailfile:
                mailfile.seek(0)
                mailfile.write(json.dumps(mail))
                mailfile.truncate()

            return

        # delete a specific message
        def deletemail(sid):
            # the current mail
            mail = None

            # open the modmail file
            with open("modmail.json", "r") as mailfile:
                mail = json.load(mailfile)

            # search the mail for a specific id
            found = False
            for x in mail:
                if x["id"] == sid:
                    del mail[mail.index(x)]
                    found = True

            # if we couldn't find the mail
            if found == False:
                return None

            # then save the file
            with open("modmail.json", "w") as mailfile:
                mailfile.seek(0)
                mailfile.write(json.dumps(mail))
                mailfile.truncate()

            # return at the end
            return "not none"

        # shows all mail
        def listall():

            # mail variable
            mail = None

            # open the modmail file and return the contents
            with open("modmail.json", "r") as mailfile:
                mail = json.load(mailfile)

            # this might happen
            if mail == []:
                return None

            # the mail
            return parseMail(mail)

        # read a specific message
        def readsinglemail(sid):

            # the current mail
            mail = None

            # open the modmail file
            with open("modmail.json", "r") as mailfile:
                mail = json.load(mailfile)

            # find the single message
            for x in range(0, len(mail)):
                if mail[x]["id"] == sid:
                    message = mail[x]
                    return parseMail(message)

            # return None if not found
            return None

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
            log(f"[{ msg.author.name } in { msg.channel.name }]: { msg.content } [{ strftime('%m/%d/%Y %H:%M:%S', gmtime()) }]")

            # no checkin yourself or the GitHub bot.
            if (msg.author.name == "Yamamura™") or (msg.author.name == "GitHub"):
                return

            # check if the message is sent by a person who is composing
            try:
                ind = composing.index(msg.author.name)
                if type(msg.channel) == discord.channel.PrivateChannel:
                    sendmail(msg.content, msg.author.name)
                    await bot.send_message(msg.author, f"Coo, { msg.author.mention }, your mail has been sent.")
                else:
                    await bot.send_message(msg.author, f"Coo, { msg.author.mention }, cancelled composing.")
                del composing[ind]
            except ValueError:
                pass

            # voting made easy
            if (msg.channel.name == "voting") or (msg.channel.name == "yamamura-suggestions") or (msg.channel.name == "voting-game-suggestions"):
                # print(msg.server.emojis[0].name)
                await bot.add_reaction(msg, u'\U0001F44D')
                await bot.add_reaction(msg, u'\U0001F44E')

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
            elif "ay" in msg.content.lower():
                if ("@everyone" in msg.content) or ("@here" in msg.content):
                    await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, no everyone pings in 'ayy' messages")
                    return
                splitmsg = msg.content.split(" ")
                msgayy = None
                for x in range(0, len(splitmsg)):
                    if re.match(r"^ay{1,}$", splitmsg[x].lower(), re.IGNORECASE & re.MULTILINE):
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

                # variable telling if the command user is eligible for mod commands
                try:
                    cfg["moderators"].index(msg.author.name)
                    mod = True
                except ValueError:
                    mod = False

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

                # prefix + modmail
                elif command("mail", msg.content):

                    # split the message and get the arguments
                    args = msg.content.split(" ")[1:]

                    # this is a subcommand command
                    if args == []:
                        await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, the mail command requires a subcommand.")
                        return

                    # test for subcommands

                    # send mail with compose in-dm
                    if args[0] == "compose":
                        await bot.send_message(msg.author, f"""Coo, { msg.author.mention },
send a message right here containing
the message that you want to send to the mods.""")
                        composing.append(msg.author.name)
                    # send mail with 1st argument as message
                    elif args[0] == "send":
                        await bot.send_message(msg.author, f"Coo, { msg.author.mention }, your message has been sent.")
                        sendmail(" ".join(args[1:]), msg.author.name)
                    # read unread mail
                    elif args[0] == "read":
                        if mod == True:
                            mail = readmail(msg.author.name)
                            if mail == None:
                                await bot.send_message(msg.author, f"Coo, { msg.author.mention }, you have no mail.")
                            else:
                                await bot.send_message(msg.author, mail)
                        else:
                            await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, you aren't a mod.")
                    # read a specific message
                    elif args[0] == "readid":
                        if mod == True:
                            mail = readsinglemail(args[1])
                            if mail == None:
                                await bot.send_message(msg.author, f"Coo, { msg.author.mention }, no mail found by that id.")
                            else:
                                await bot.send_message(msg.author, mail)
                        else:
                            await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, you aren't a mod.")
                    # read all messages
                    elif args[0] == "all":
                        if mod == True:
                            mail = listall()
                            if mail == None:
                                await bot.send_message(msg.author, f"Coo, { msg.author.mention }, there is no mail.")
                            else:
                                await bot.send_message(msg.author, mail)
                        else:
                            await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, you aren't a mod.")
                    # clean mail
                    elif args[0] == "clean":
                        if mod == True:
                            cleanmail(cfg["moderators"])
                            await bot.send_message(msg.author, f"Coo, { msg.author.mention }, cleaned mail.")
                        else:
                            await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, you aren't a mod.")
                    # delete a specific message
                    elif args[0] == "delete":
                        if mod == True:
                            mail = deletemail(args[1])
                            if mail == None:
                                await bot.send_message(msg.author, f"Coo, { msg.author.mention }, couldn't find a message with that id.")
                            else:
                                await bot.send_message(msg.author, f"Coo, { msg.author.mention }, deleted message.")
                        else:
                            await bot.send_message(msg.channel, f"Coo, { msg.author.mention }, you aren't a mod.")
                    # subcommand not found
                    else:
                        await bot.send_message(msg.author, f"Coo, { msg.author.mention }, { args[0] } is not a mail command.")

                    # return at the end
                    return

        bot.run(cfg["token"])

# trying to split an image message doesn't work
except ValueError:
    pass
