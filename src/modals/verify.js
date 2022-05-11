const { ModalSubmitInteraction } = require('discord-modals');

/**
 *
 * @param {ModalSubmitInteraction} modal
 */
async function verifyModalSubmitHandler(modal) {
	const isPiracyAllowedResponse = modal.getTextInputValue('is-piracy-allowed');
	const sexismIsNotAllowedResponse = modal.getTextInputValue('sexism-is-not-allowed');
	const isSwearingAllowedResponse = modal.getTextInputValue('is-swearing-allowed');
	const spamGeneralResponse = modal.getTextInputValue('can-spam-general');

	await modal.reply('Thinking...'); // Modal wants a response

	if (
		isPiracyAllowedResponse !== 'no' ||
		sexismIsNotAllowedResponse !== 'yes' ||
		isSwearingAllowedResponse !== 'yes' ||
		spamGeneralResponse !== 'no'
	) {
		await modal.member.send('Rule verification failed. Please try again\n(message sent via DMs as ephemeral responses do not work with modals)');
	} else {
		const guild = await modal.guild.fetch();
		const roles = await guild.roles.fetch();
		const unverifiedRole = roles.find(role => role.name === 'unverified');
		const memberRole = roles.find(role => role.name === 'member');

		await modal.member.roles.add(memberRole);
		await modal.member.roles.remove(unverifiedRole);
	}

	await modal.deleteReply(); // Don't show it for real
}

module.exports = verifyModalSubmitHandler;