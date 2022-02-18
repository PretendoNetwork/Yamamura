const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var convert = require('xml-js');
var fetch  = (...args) =>
import('node-fetch').then(({ default: fetch }) => fetch(...args));//require('node-fetch');

module.exports = {
	//A command which gets info from a PNID
	
	data: new SlashCommandBuilder()
		.setName('pnid')
		.setDescription('Gets PNID')
		.addStringOption(Message => Message.setName("pnid").setDescription("Users PNID").setRequired(true)),
		async execute(interaction) {                    

		//Get the PNID
	
			const PNID = interaction.options.data[0].value

		try {

			const response = await fetch(`https://account.pretendo.cc/v1/api/people/${PNID}`, {
						headers: {"X-Nintendo-Client-ID": "a2efa818a34fa16b8afbc8a74eba3eda","X-Nintendo-Client-Secret": "c91cdb5658bd4954ade78533a339cf9a"}
					});
					//Get Response to see if the account exists
					const Val = await response.text()
					var JSV2 = convert.xml2json(Val,{compact: true, spaces: 4})
					JSV2 = JSON.parse(JSV2)

				//Check if account exists

			if (response.status === 200 || !JSV2.errors || JSV2.errors.error.code._text !== "0100") {
				
				//Account does not exist 

				const Emb = await MakeEmbed(false,null,null,"Account Does Not Exist")
				await interaction.reply({ embeds: [Emb] });
				return
			}

			//Get PID

				const response2 = await fetch(`https://account.pretendo.cc/v1/api/admin/mapped_ids?input_type=user_id&output_type=pid&input=${PNID}`, {
						headers: {"X-Nintendo-Client-ID": "a2efa818a34fa16b8afbc8a74eba3eda","X-Nintendo-Client-Secret": "c91cdb5658bd4954ade78533a339cf9a"}
				});	
					var PID = "0"
					if (response2.status === 200)	{

					//Check if it was a success

					const Val = await response2.text()
					var JSV = convert.xml2json(Val,{compact: true, spaces: 4})
					JSV = JSON.parse(JSV)
					PID = JSV.mapped_ids.mapped_id.out_id._text
					}
					else{
						const Emb = await MakeEmbed(false,null,null,"Something went wrong.")
						await interaction.reply({ embeds: [Emb] });
						return
					}

		const Emb = await MakeEmbed(true,PID,PNID,"")
		await interaction.reply({ embeds: [Emb] });
		return

			}
			catch(e){
				const Emb = await MakeEmbed(false,null,null,e)
				await interaction.reply({ embeds: [Emb] });
						return
			}	
	},
};
function MakeEmbed(IsSuccess,PID,PNID,ErrorMessage) {

	if (IsSuccess){
		const Embeded = new MessageEmbed()
		.setColor("#8732a8")
		.setTitle(PNID)
		.setThumbnail(`https://pretendo-cdn.b-cdn.net/mii/${PID}/normal_face.png`)
		.setURL(`https://portal.olv.pretendo.cc/users/show?pid=${PID}`)
		.setDescription("Check this User on Juxt!")
	return Embeded
	
		}else{
			
		const Embeded = new MessageEmbed()
		.setColor("#ff0000")
		.setTitle("Error")
		.setDescription(ErrorMessage)
		
	return Embeded
	}
}

