const glob = require('glob');
const path = require('path');

const modals = {};

const modalFiles = glob.sync(__dirname + '/modals/*.js');

for (const file of modalFiles) {
	const modal = require(path.resolve(file));

	modals[modal.modal.customId] = modal;
}

module.exports = modals;