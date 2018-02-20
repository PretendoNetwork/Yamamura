import discord
import asyncio
from discord.ext.commands import Bot
from discord.ext import commands
import platform

client = Bot(description="Yamamura by superwhiskers", command_prefix=".", pm_help = True)

@client.event
async def on_ready():
    print('logged in as: '+client.user.name+' (id:'+client.user.id+') | connected to '+str(len(client.servers))+' server(s)')
    print('invite: https://discordapp.com/oauth2/authorize?client_id={}&scope=bot&permissions=8'.format(client.user.id))
    return await client.change_presence(game=discord.Game(name='with edamame'))

@client.command()
async def ping():
    """ping pong"""
    await client.say("pong")
    
client.run('place key here')
