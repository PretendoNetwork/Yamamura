const fs = require('fs');
const { Client, Intents, Collection,MessageEmbed } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const config = require('../config.json')

client.commands = new Collection();
const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`../src/commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;


	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} 	
		catch (error) {
			
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(config.Token)

//Sets the Slash Commands Automactically
require('./deploy-commands.js').run()


client.once('ready', () => {
	console.log('Ready!');
});
