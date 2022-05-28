const glob = require('glob');
const path = require('path');

const selectMenus = {};

const selectMenuFiles = glob.sync(__dirname + '/select-menus/*.js');

for (const file of selectMenuFiles) {
	const selectMenu = require(path.resolve(file));

	selectMenus[selectMenu.select_menu.customId] = selectMenu;
}

module.exports = selectMenus;