import discord
import asyncio
from discord.ext.commands import Bot
from discord.ext import commands
import platform

client = Bot(description="Yamamura by superwhiskers", command_prefix=".", pm_help = True)

# find a role by it's name
def getRoleByName(name, rolesList):
    for x in range(0, len(rolesList)):
        if rolesList[x].name == name:
            return rolesList[x]

@client.event
async def on_ready():

    # print some output
    print('logged in as: '+client.user.name+' (id:'+client.user.id+') | connected to '+str(len(client.servers))+' server(s)')
    print('invite: https://discordapp.com/oauth2/authorize?client_id={}&scope=bot&permissions=8'.format(client.user.id))
    return await client.change_presence(game=discord.Game(name='with edamame'))

@client.event
async def on_message(msg):
    if (msg.channel.name == "voting") or (msg.channel.name == "voting-game-suggestions"):
        # print(msg.server.emojis[0].name)
        await client.add_reaction(msg, u'\U0001F44D')
        await client.add_reaction(msg, u'\U0001F44E')
    elif msg.content == "ayy":
        await client.send_message(msg.channel, "lmao")
    elif "i'm a teapot" in msg.content.lower():
        role = getRoleByName("Real Devs", msg.server.roles)
        await client.add_roles(msg.author, role)

client.run('put bot key here')
