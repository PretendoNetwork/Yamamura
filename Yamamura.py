from discord.ext.commands import Bot
from time import gmtime, strftime
import discord
import time
import json
import re
import string
import aiohttp

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

# check if the tags file exists
with open("tags.json", "a+") as tags_file:
    tags_file.seek(0)
    if tags_file.read() == "":
        tags_file.write("{}")

# help msg
helpmsg = f"""```
Yamamura™, the Pretendo Discord bot

General:
    {cfg["prefix"]}help                                 : Shows this message
    {cfg["prefix"]}toggleupdates                        : Toggles the Updates role
    {cfg["prefix"]}authors                              : Shows the authors of the bot
Tags:
    {cfg["prefix"]}tag <name>                           : Shows a tag's content
    {cfg["prefix"]}tag mk/make/create <name> <txt>      : Creates a tag (mods only)
    {cfg["prefix"]}tag rm/del/remove/delete <name>      : Deletes a tag (mods only)
    {cfg["prefix"]}tag ls/list                          : Shows the tags available
Mail:
    {cfg["prefix"]}mail send <msg>                      : Send a message to the mods with msg as message
    {cfg["prefix"]}mail compose                         : Send a message to the mods in-dms (private)
    {cfg["prefix"]}mail read                            : Read mail (mods only)
    {cfg["prefix"]}mail readid <id>                     : Read mail by id (mods only)
    {cfg["prefix"]}mail all                             : Read all mail (mods only)
    {cfg["prefix"]}mail clean                           : Clean mail read by all mods (mods only)
    {cfg["prefix"]}mail delete <id>                     : Delete mail by id (mods only)
```"""

# author message
authors = """```
superwhiskers (@!superwhiskers™#3210): bot concept and main developer
Netux         (@Netux#2308): certain features and some regex work
Pika          (@《ThatNerdyPikachu》#2849): features and rewrote bot to use newlib```"""

# currently composing people
composing = []
try:
    if cfg:
        # get the bot
        bot = Bot(description="Yamamura by superwhiskers & friends", command_prefix=cfg["prefix"])

        # useful functions

        # log to the message log
        def log(string):
            print(string)
            with open("output.log", "a") as output:
                output.write(string + "\n")

        # return true if user is mod
        def is_mod(user):
            return user.id in cfg["moderators"]

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
        def cleanmail():
            # list of moderator's usernames
            mods = cfg["moderators"]

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

        # Tag helpers
        def get_tags():
            with open("tags.json", "r") as tags_file:
                return json.load(tags_file)

        def get_tag(tag_name):
            tags = get_tags()

            for name, tag in tags.items():
                if name == tag_name:
                    return tag

            return None

        def create_tag(name, content):
            tags = get_tags()

            tags[name] = {
                # support for future additions
                'content': content
            }

            save_tags(tags)

        def delete_tag(name):
            tags = get_tags()

            del tags[name]

            save_tags(tags)

        def save_tags(tags):
            with open("tags.json", "w") as tags_file:
                tags_file.seek(0)
                tags_file.write(json.dumps(tags))
                tags_file.truncate()

        # returns the server the bot is in
        def server():
            for x in bot.guilds:
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

        def coo(channel, target_user, response):
            target_part = f"{ target_user.mention }, " if target_user != None else ""

            return channel.send(f"Coo, { target_part }{ response }")

        @bot.event
        async def on_ready():

            # set server var
            for x in bot.guilds:
                bot.server = x
                break

            # print some output
            print(f"logged in as: { bot.user.name } (id:{ bot.user.id }) | connected to { str(len(bot.guilds)) } server(s)")
            print(f"invite: https://discordapp.com/oauth2/authorize?bot_id={ bot.user.id }&scope=bot&permissions=8")
            await bot.change_presence(activity=discord.Game(name='with edamame'))

        # message handling
        @bot.event
        async def on_message(msg):

            # log-em, but first we gotta strip those nasty unicode characters! >:D
            if type(msg.channel) != discord.channel.DMChannel:
                str = f"[{ msg.author.name } in { msg.channel.name }]: { msg.content } [{ strftime('%m/%d/%Y %H:%M:%S', gmtime()) }]"
                printable = set(string.printable)
                logstr = ''.join(filter(lambda x: x in string.printable, str))
                log(logstr)
            else:
                str = f"[DM with { msg.author.name }]: { msg.content } [{ strftime('%m/%d/%Y %H:%M:%S', gmtime()) }]"
                printable = set(string.printable)
                logstr = ''.join(filter(lambda x: x in string.printable, str))
                log(logstr)

            # no checkin yourself or the GitHub bot.
            if msg.author.bot:
                return

            # check if the message is sent by a person who is composing
            try:
                ind = composing.index(msg.author.name)
                if type(msg.channel) == discord.channel.DMChannel:
                    sendmail(msg.content, msg.author.name)
                    await coo(msg.author, msg.author, "your mail has been sent.")
                else:
                    await coo(msg.author, msg.author, "cancelled composing.")
                del composing[ind]
            except ValueError:
                pass

            # voting made easy
            if type(msg.channel) != discord.DMChannel:
                if (msg.channel.name == "voting") or (msg.channel.name == "yamamura-suggestions") or (msg.channel.name == "voting-game-suggestions"):
                        await msg.add_reaction(u'\U0001F44D')
                        await msg.add_reaction(u'\U0001F44E')

            # do you like teapots? dun dun dun dun dunnn....
            elif "i'm a teapot" in msg.content.lower():
                if hasRole(msg.author, "Real Devs"):
                    await msg.author.remove_roles(role("Real Devs"))
                    await coo(msg.channel, msg.author, "you no longer have the Real Devs role.")
                else:
                    await msg.author.add_roles(role("Real Devs"))
                    await coo(msg.channel, msg.author, "you now have the Real Devs role.")
                await msg.channel.delete_message(msg)

            # i'd just like to interject for a moment...
            elif "linux" in msg.content.lower():

                # make sure it is only linux
                splitmsg = msg.content.split(" ")

                # search for linux
                interject = False
                for x in range(0, len(splitmsg)):
                    if splitmsg[x].lower() == "linux":
                        interject = True
                        break

                # check to see if it is a good place to send it
                if not (msg.channel.id in cfg["spam_channels"]):
                    interject = False

                # interject
                if interject == True:
                    await msg.channel.send(f"""I'd just like to interject for a moment, { msg.author.mention }. What you're referring to as Linux, is in fact, GNU/Linux, or as I've recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX. Many computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called "Linux", and many of its users are not aware that it is basically the GNU system, developed by the GNU Project. There really is a Linux, and these people are using it, but it is just a part of the system they use. Linux is the kernel: the program in the system that allocates the machine's resources to the other programs that you run. The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system. Linux is normally used in combination with the GNU operating system: the whole system is basically GNU with Linux added, or GNU/Linux. All the so-called "Linux" distributions are really distributions of GNU/Linux.""")
                    return

	    # the redux meme
            elif "reduxredstone" in msg.content.lower():

                # split the message
                splitmsg = msg.content.split(" ")

                # check to see if this is a good place to send it
                sendgudmeme = False
                for x in range(0, len(splitmsg)):
                    if splitmsg[x].lower() == "reduxredstone":
                        sendgudmeme = True
                        break
                if not (msg.channel.id in cfg["spam_channels"]):
                    sendgudmeme = False

                # send it if appropriate
                if sendgudmeme == True:
                    await msg.channel.send("Ahh, I remember the great ReduxRedstone incident of 2018. Everyone set their username to ReduxRedstone, which is RedDucks old name.\nhttps://www.youtube.com/user/halolink4\nhttps://www.github.com/ReduxRedstone\n(thank pika for this)")
                    return

            # eh ayy?
            elif "ay" in msg.content.lower():

                # no everyones
                if ("@everyone" in msg.content) or ("@here" in msg.content):
                    await coo(msg.channel, msg.author, "no everyone pings in 'ayy' messages")
                    return

                # split the message
                splitmsg = msg.content.split(" ")

                # the part of the string that contains the 'ayy'
                msgayy = None

                # find the part of the string with 'ayy'
                for x in range(0, len(splitmsg)):
                    if re.match(r"^ay{1,}$", splitmsg[x].lower(), re.IGNORECASE & re.MULTILINE):
                        msgayy = splitmsg[x]
                        slot = x
                        break

                # if nothing was found, stop the handler
                if msgayy != None:

                    # replacement string
                    ret = ""

                    # regexes don't work at all with this for some reason.
                    # see commit cfa4e40d53b637132a7d120918aa03c52c04c720 if you want to fix it..
                    for x in range(0, len(msgayy)):
                        if msgayy[x] == "y":
                            ret += "o"
                        elif msgayy[x] == "Y":
                            ret += "O"
                        elif msgayy[x] == "a":
                            ret += "lma"
                        elif msgayy[x] == "A":
                            ret += "LMA"

                    # concatenating the message
                    fullret = splitmsg
                    fullret[slot] = ret
                    fullret = " ".join(fullret)

                    # if the string is too long,
                    if len(fullret) > 2000:

                        # i'm too lazy to implement splicing the message
                        if len(fullret) > 2000:
                            await coo(msg.channel, msg.author, "your message is too long.")
                            return

                    # SEND IT ALREADY!!!
                    await msg.channel.send(fullret)

            # if the first character is the prefix
            elif msg.content[0] == cfg["prefix"]:

                # variable telling if the command user is eligible for mod commands
                mod = is_mod(msg.author)

                # prefix + help
                if command("help", msg.content):
                    await msg.author.send(helpmsg)

                # prefix + remindme
                elif command("toggleupdates", msg.content):
                    if hasRole(msg.author, "Updates"):
                        await msg.author.remove_roles(role("Updates"))
                        await coo(msg.channel, msg.author, "you no longer have the Updates role.")
                    else:
                        await msg.author.add_roles(role("Updates"))
                        await coo(msg.channel, msg.author, "you now have the Updates role.")

                # prefix + authors
                elif command("authors", msg.content):
                    await msg.author.send(authors)

                # prefix + modmail
                elif command("mail", msg.content):

                    # split the message and get the arguments
                    args = msg.content.split(" ")[1:]

                    # this is a subcommand command
                    if args == []:
                        await coo(msg.channel, msg.author, "the mail command requires a subcommand.")
                        return

                    # test for subcommands

                    # send mail with compose in-dm
                    if args[0] == "compose":
                        await coo(msg.author, msg.author, """send a message right here containing
the message that you want to send to the mods.""")
                        composing.append(msg.author.name)
                    # send mail with 1st argument as message
                    elif args[0] == "send":
                        await coo(msg.author, msg.author, "your message has been sent.")
                        sendmail(" ".join(args[1:]), msg.author.name)
                    # read unread mail
                    elif args[0] == "read":
                        if mod == True:
                            mail = readmail(msg.author.name)
                            if mail == None:
                                await coo(msg.author, msg.author, "you have no mail.")
                            else:
                                await msg.author.send(mail)
                        else:
                            await coo(msg.channel, msg.author, "you aren't a mod.")
                    # read a specific message
                    elif args[0] == "readid":
                        if mod == True:
                            mail = readsinglemail(args[1])
                            if mail == None:
                                await coo(msg.author, msg.author, "no mail found by that id.")
                            else:
                                await msg.author.send(mail)
                        else:
                            await coo(msg.channel, msg.author, "you aren't a mod.")
                    # read all messages
                    elif args[0] == "all":
                        if mod == True:
                            mail = listall()
                            if mail == None:
                                await coo(msg.author, msg.author, "there is no mail.")
                            else:
                                await msg.author.send(mail)
                        else:
                            await coo(msg.channel, msg.author, "you aren't a mod.")
                    # clean mail
                    elif args[0] == "clean":
                        if mod == True:
                            cleanmail()
                            await coo(msg.author, msg.author, "cleaned mail.")
                        else:
                            await coo(msg.channel, msg.author, "you aren't a mod.")
                    # delete a specific message
                    elif args[0] == "delete":
                        if mod is True:
                            mail = deletemail(args[1])
                            if mail is None:
                                await coo(msg.author, msg.author, "couldn't find a message with that id.")
                            else:
                                await coo(msg.author, msg.author, "deleted message.")
                        else:
                            await coo(msg.channel, msg.author, "you aren't a mod.")
                    # subcommand not found
                    else:
                        await coo(msg.author, msg.author, f"{ args[0] } is not a mail command.")

                    # return at the end
                    return

                elif command("tag", msg.content):
                    args = msg.content.split(" ")[1:]
                    args_len = len(args)
                    create_subcmds = [ "mk", "make", "create" ]
                    delete_subcmds = [ "rm", "del", "remove", "delete" ]
                    list_subcmds = [ "ls", "list" ]
                    reserved_words = create_subcmds + delete_subcmds + list_subcmds

                    if args_len <= 0:
                        await coo(msg.channel, msg.author, "this command requires more arguments.")
                    else:
                        subcommand = args[0].lower()

                        if subcommand in create_subcmds:
                            if is_mod(msg.author):
                                if args_len >= 3:
                                    tag_name = args[1]

                                    if tag_name in reserved_words:
                                        await coo(msg.channel, msg.author, "nice try but that's a reserved name.")
                                    else:
                                        create_tag(tag_name, " ".join(args[2:]))
                                        await coo(msg.channel, msg.author, f"tag { tag_name } created.")
                                else:
                                    await coo(msg.channel, msg.author, "this command requires you give the tag a name and content.")
                            else:
                                await coo(msg.channel, msg.author, "only moderators can create tags.")
                        elif subcommand in delete_subcmds:
                            if is_mod(msg.author):
                                if args_len >= 2:
                                    tag_name = args[1]
                                    tag = get_tag(tag_name)

                                    if tag:
                                        delete_tag(tag_name)
                                        await coo(msg.channel, msg.author, f"tag { tag_name } deleted.")
                                    else:
                                        await coo(msg.channel, msg.author, f"there is no tag \"{ tag_name }\" to delete. Did you misspell the name?")
                                else:
                                    await coo(msg.channel, msg.author, "this command requires you give the tag to delete.")
                            else:
                                await coo(msg.channel, msg.author, "only moderators can delete tags.")
                        elif subcommand in list_subcmds:
                            tag_list = get_tags()
                            tag_list_msg = f"""tags available: ```
{ ", ".join(tag_list) if len(tag_list) > 0 else "<none>" }
```"""

                            if msg.channel.id in cfg["spam_channels"]:
                                await coo(msg.channel, None, tag_list_msg)
                            else:
                                await coo(msg.author, None, tag_list_msg)
                                await coo(msg.channel, msg.author, "sent list in DMs")
                        else:
                            tag = get_tag(args[0])

                            if tag == None:
                                await coo(msg.channel, msg.author, f"\"{ args[0] }\" is not a tag or subcommand")
                            else:
                                await msg.channel.send(tag['content'])

                elif command("status", msg.content):
                    async with aiohttp.ClientSession() as cs:
                        async with cs.get("https://account.pretendo.cc/isthisworking") as r:
                            resp = await r.json(content_type="text/html")
                            if resp is not None and resp["server"] == "account.nintendo.net":
                                await coo(msg.channel, msg.author, "the offical Pretendo servers are indeed online!")
                            else:
                                await coo(msg.channel, msg.author, "the offical Pretendo servers are offline! Oh no...")

        bot.run(cfg["token"])

# trying to split an image message doesn't work
except ValueError:
    pass
