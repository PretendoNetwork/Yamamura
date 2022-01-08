const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	//Donation Command
	data: new SlashCommandBuilder()
		.setName('donate')
		.setDescription('Donate and Support Pretendo!')
		.addStringOption(Message => Message.setName("donation_site").setDescription("Patreon or Ko-Fi").addChoices([["Patreon","PAT"],["Ko-Fi","KFI"]]).setRequired(true)),
		async execute(interaction) {

		const donweb = interaction.options.data[0].value
		var Send = "That Shouldn't Have Occured!"
		if (donweb === "PAT") {
			Send = "https://patreon.com/pretendonetwork"
		}
		else if (donweb === "KFI") {
			Send = "https://ko-fi.com/pretendonetwork"
		}
		await interaction.reply(Send);
			return
	},
};
