const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	//AYY, LMAO!
	data: new SlashCommandBuilder()
		.setName('ayy')
		.setDescription('LMAO!')
		.addStringOption(Message => Message.setName("message").setDescription("Optional Damage")),
		async execute(interaction) {

		
		
		var Send = "LMAO"
		//Checks if message and less than 1990 charaters
		if (interaction.options.data[0]) {
			const message = interaction.options.data[0].value
			if ( message.length >= 1990) {
				await interaction.reply("Message Too Long!");
				return
			}
			Send += `, ${message}`
		}
		Send += "!"
		await interaction.reply(Send);
			return
	},
};
