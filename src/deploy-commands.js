const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { ClientID, GuildID, Token } = require('../config.json');
module.exports = { async run() {
	//This is an automatic Slash Command Creator for the specific Guild
const commands = [];
const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`../src/commands/${file}`);
	commands.push(command.data.toJSON());
}
const rest = new REST({ version: '9' }).setToken(Token);

rest.put(Routes.applicationGuildCommands(ClientID, GuildID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
}
}
