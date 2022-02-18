const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const errorlistfolder = fs.readdirSync('data/errorcodes')
module.exports = {
	//Oh Boi this Slash Command is for getting details from an error Code
	data: new SlashCommandBuilder()
		.setName('errorcode')
		.setDescription('Gets Info from your error code')
        .addStringOption(codeid => codeid.setName("errorcode").setDescription('The Error Code ID').setRequired(true)),
		async execute(interaction) {
        const errordata = interaction.options.data[0].value

		//checks if the message has a -
		if (!errordata.includes("-")){
			const Emb = await MakeEmbed(false,errordata,null,false)
			await interaction.reply({ embeds: [Emb] });
			return
		}

		var Header = errordata.split("-")[0]
		var Code = errordata.split("-")[1]
		
		//This is used for getting the information Required for Custom Error Codes
		const ErrorCodeTable = await IsCustomErrorCode(errordata,Header,Code)
		const IsUsingAlternateHeader = ErrorCodeTable[1]
		const IsUsingAlternateCode = ErrorCodeTable[3]
		if (IsUsingAlternateHeader){
		Header = ErrorCodeTable[2]
		}

		//Checks if the ErrorCode is in the DataBase
		if (!errorlistfolder.includes(Header + ".json")) {
			var Emb = await MakeEmbed(false,errordata,null,true)
			await interaction.reply({ embeds: [Emb] });
			return
		}

		const ErrorCodeJSONData = await require(`../../data/errorcodes/${Header}.json`)
		
		//Resets the code back to a 4 digits in case of a custom one and does not have 4 digits
		if (IsUsingAlternateCode) {
		var AlternateCode = Code.replace(Code.slice(0,ErrorCodeJSONData.AlternateCode.RemoveStringPosition),Code.slice(0,ErrorCodeJSONData.AlternateCode.RemoveStringPosition) + "0" + Code.slice(ErrorCodeJSONData.AlternateCode.RemoveStringPosition + 2))
		Code = AlternateCode
		}

		//Checks if the Code is a WiiU Error (For now Only the WiiU until the 3DS gets some life)
		if (!IsWiiUErrorCode(errordata,Header,Code)) {
			const Emb = await MakeEmbed(false,errordata,null,false)
			await interaction.reply({ embeds: [Emb] });
			return
		}
		
	//Checks if the full code exists
	if (ErrorCodeJSONData.Codes[Code]) {
			const Emb = await MakeEmbed(true,ErrorCodeJSONData.Codes[Code],ErrorCodeJSONData,true,IsUsingAlternateHeader,IsUsingAlternateCode)
			await interaction.reply({ embeds: [Emb] });
			return
	}

	//Checks if the first part of the code exists
	else if(ErrorCodeJSONData.Codes[Code.charAt(0) + "XXX"]) {
			const Emb = await MakeEmbed(true,ErrorCodeJSONData.Codes[Code.charAt(0) + "XXX"],ErrorCodeJSONData,true,IsUsingAlternateHeader,IsUsingAlternateCode)
			await interaction.reply({ embeds: [Emb] });
			return
	}
	//Code does not exist in the Database	
	else{
			const Emb = await MakeEmbed(false,errordata,null,true)
			await interaction.reply({ embeds: [Emb] });
			return
	}
	
	},
};

//Creates the Embed for the Message
function MakeEmbed(Suceess,ErrorCode,Table,IsValid,IsUsingAlternateHeader,IsUsingAlternateCode) {
	if (Suceess) {
	//ErrorCode Exists in the DataBase

	const Embeded = new MessageEmbed()
	.setColor(Table.Color)
	.setDescription(ErrorCode.Description)

	//Checks if to use the AlternateHeader instead of the Main one (For the Custom ErrorCodes)
	if (IsUsingAlternateHeader){
	var OldErrorC = ErrorCode.Name
	var NewErrorCode = OldErrorC
	NewErrorCode = NewErrorCode.replace(OldErrorC.slice(0,3),Table.AlternateHeader)

	//Checks if to use Custom Code if it is less than the normal 4 digits
	if (IsUsingAlternateCode){
		NewErrorCode = NewErrorCode.replace(5,OldErrorC.split("-")[1])
		NewErrorCode = NewErrorCode.replace("0","")
	}
	Embeded.setTitle(`${NewErrorCode} (${Table.Type})`)
	}

	else{
	Embeded.setTitle(`${ErrorCode.Name} (${Table.Type})`)
	}

	//Checks if the ErrorCode has a Solution and has a Value
	if (ErrorCode.Solution && ErrorCode.Solution !== "N/A"){
	Embeded.addFields({name: 'Solution',value: ErrorCode.Solution,incline: true})
}
return Embeded

}else{

	if (IsValid) {
	
	//Means the ErrorCode Format is correct but the ErrorCode is not in the DataBase
	const Embeded = new MessageEmbed()
	.setColor("#ff0000")
	.setTitle(`ERROR: ErrorCode not Found`)
	.setDescription(`Could not find ${ErrorCode}`)
	return Embeded
}
	//Means the ErrorCode Format is wrong
	const Embeded = new MessageEmbed()
	.setColor("#ff0000")
	.setTitle(`ERROR: Invalid Format`)
	.setDescription(`Please use the correct format \n Example: 598-3231`)
	return Embeded
}
}

//Checks if the ErrorCode is a WiiU Format
function IsWiiUErrorCode(ErrorData,Header,Code){
	if (!ErrorData.includes("-",3) || Header.length !== 3 || Code.length !== 4 ||  isNaN(Header) || isNaN(Code.charAt(0))) {
		return false;
	}
	else {
		return true;
	}
}

//Custom Code Handler and Checks if the ErrorCode exists
const CustomCodeList =  require('../../data/errorcodes/CustomErrorCodes.json')
function IsCustomErrorCode(ErrorData,Header,Code) {
		//Checks if Code (The String after - exists)
		if (!Code){return false;}
		const Max = CustomCodeList.length
 		for (let i = 1;i <= Max;i++){
		
		const Head = CustomCodeList[i].Header
		const CodeLength = CustomCodeList[i].CodeLength

		if (Header === Head && Code.length === CodeLength && ErrorData.includes("-",Head.length)){
	
		//Set the Header to Equal the Actual Header Code
		Header = CustomCodeList[i].HCode
		
		const IsUsingAlternateHeader = true		
		var IsUsingAlternateCode = false

		//Checks if the code is not 4 digits long (WiiU Format)
		if (CodeLength !== 4) {IsUsingAlternateCode = true}
		return [true,IsUsingAlternateHeader,CustomCodeList[i].HCode,IsUsingAlternateCode];
	}}
		return false;
}