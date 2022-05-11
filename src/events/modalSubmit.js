const { ModalSubmitInteraction } = require('discord-modals');
const verifyModalSubmitHandler = require('../modals/verify');

/**
 * 
 * @param {ModalSubmitInteraction} modal
 */
async function modalSubmitHandler(modal) {
	switch (modal.customId) {
		case 'verify':
			await verifyModalSubmitHandler(modal);
			break;
	
		default:
			await modal.reply(`Missing modal submit handler for \`${modal.customId}\``);
			break;
	}
}

module.exports = modalSubmitHandler;