const { SlashCommand } = require('slash-create');

const allowedRoles = [
	{
		name: 'Updates',
		value: 'Updates'
	},
	{
		name: 'Stream Ping',
		value: 'StreamPing',
	}
];

class ToggleRoleCommand extends SlashCommand {
	constructor(bot, creator) {
		super(creator, {
			name: 'togglerole',
			description: 'Toggle the provided role',
			options: [
				{
					name: 'role',
					description: 'Role name',
					required: true,
					type: 3,
					choices: allowedRoles
				}
			]
		});

		this.bot = bot;

		this.filePath = __filename;
	}

	async run(ctx) {
		const bot = this.bot;

		const guild = await bot.guilds.fetch(ctx.data.guild_id, true);
		const user = await guild.members.fetch(ctx.data.member.user.id, true);
		const role = await guild.roles.cache.find(r => r.name === ctx.options.role);

		if (!role) {
			return `Could not find role ${ctx.options.role}!`;
		}
		
		const hasRole = await user.roles.cache.find(r => r.name === ctx.options.role);
		
		if (hasRole) {
			await user.roles.remove(role);
		} else {
			await user.roles.add(role);
		}

		return `Toggling role ${ctx.options.role} [${hasRole ? 'REMOVED' : 'ADDED'}]!`;
	}

	onError(err) {
		console.log(err);
	}
}

module.exports = ToggleRoleCommand;