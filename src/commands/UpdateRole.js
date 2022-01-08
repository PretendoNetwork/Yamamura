const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	//This Slash Command is for adding or removing the roles that a user can have
	data: new SlashCommandBuilder()
		.setName('updaterole')
		.setDescription('Gives/Removes the role the user requested')
        .addStringOption(role => role.setName("role").setDescription("The Role Requested").addChoices([["Updates","Updates"],["Stream Ping","StreamPing"]]).setRequired(true)),
		async execute(interaction) {

		const rolename = interaction.options.data[0].value
		const guild = interaction.guild
		const role = await guild.roles.cache.find(r => r.name === rolename);
		
		//Checks if the Role Exists
		if (!role) {
			console.log(`Could not find role ${rolename}!`);
			const Emb = await MakeEmbed(interaction.user,false,true,rolename)
			await interaction.reply({ embeds: [Emb] });
			return
		}

		const user = await guild.members.cache.get(interaction.user.id)
		const hasRole = await user.roles.cache.has(role.id);
		var color = "#"+ role.color.toString(16).padStart(6, '0')
		
		//Checks if User has the Role
		if (!hasRole) {
			user.roles.add(role)
			const Emb = await MakeEmbed(interaction.user,true,true,role.id,color)
		await interaction.reply({ embeds: [Emb] });
		} else {
			user.roles.remove(role)
			const Emb = await MakeEmbed(interaction.user,true,false,role.id,color)
		await interaction.reply({ embeds: [Emb] });
		}
	},
};
//Creates the Embed for the Message
function MakeEmbed(Author,IsSuccess,AddingRole,Role,color) {
	//Checks if it a Successfull Operation
	if (IsSuccess){
	const Embeded = new MessageEmbed()
	.setAuthor({name: Author.username, iconURL:Author.avatarURL()})
	.setColor(color)
	.setTitle("Role Updated")

	if (AddingRole){
	Embeded.setDescription(`User has been given the <@&${Role}> role!`)
	}

	else
	{
	Embeded.setDescription(`User has removed the <@&${Role}> role!`)
	}

return Embeded

	}else{

	//Likely Means that the Role does not Exist
	const Embeded = new MessageEmbed()
	.setAuthor({name: Author.username, iconURL:Author.avatarURL()})
	.setColor("#ff0000")
	.setTitle("Error")
	.setDescription(`Could not find the @${Role} role!`)
	
return Embeded
}
}