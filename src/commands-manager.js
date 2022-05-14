const glob = require('glob');
const path = require('path');

const commands = {};

const commandFiles = glob.sync(__dirname + '/commands/*.js');

for (const file of commandFiles) {
	const command = require(path.resolve(file));

	commands[command.deploy.name] = command;
}

module.exports = commands;