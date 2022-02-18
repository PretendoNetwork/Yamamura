const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const guidesfolder = fs.readdirSync('data/guides')
module.exports = {
	//This Command is for getting the guide links
	data: new SlashCommandBuilder()
		.setName('guide')
		.setDescription('Provides Links to guides')
		.addStringOption(guidetype => guidetype.setName("guidetype").setDescription("A specefic Guide").addChoices([["WiiU HomeBrew","WiiUHomeBrew"]]).setRequired(true)),
		async execute(interaction) {

		const GuideName = interaction.options.data[0].value

		//Checks if the Guide is in the DataBase
		if (!guidesfolder.includes(GuideName + ".json")) {
			await interaction.reply("It could not find that guide");
			return
		}

		const Guide =  require(`../../data/guides/${GuideName}.json`)
		const Emb = await MakeEmbed(Guide.Title,Guide.Image,Guide.Link,Guide.Color,Guide.Description)
		await interaction.reply({ embeds: [Emb] });
		return
	},
};

//Creates the Embed for the Message
function MakeEmbed(Title,Image,Link,Color,Description) {
	const Embeded = new MessageEmbed()
	.setThumbnail(Image)
	.setColor(Color)
	.setTitle(Title)
	.setURL(Link)
	.setDescription(Description)
return Embeded
}