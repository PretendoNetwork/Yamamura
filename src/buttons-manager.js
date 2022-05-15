const glob = require('glob');
const path = require('path');

const buttons = {};

const buttonFiles = glob.sync(__dirname + '/buttons/*.js');

for (const file of buttonFiles) {
	const button = require(path.resolve(file));

	buttons[button.button.customId] = button;
}

module.exports = buttons;