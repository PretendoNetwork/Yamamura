#!/usr/local/bin/python3.6
from discord.ext.commands import Bot
import discord
import json

with open("config.json", "r") as cfg:
	cfg = json.load(cfg)

bot = Bot(description="Yamamura", command_prefix=cfg["prefix"])

@bot.event
async def on_ready():
	for x in bot.guilds:
		server = x
		break
	while True:
		msg = input("message: ")
		channel_name = input("channel: ")
		channel = discord.utils.get(server.channels, name=channel_name)
		await channel.send(msg)
		print("sent")

bot.run(cfg["token"])

