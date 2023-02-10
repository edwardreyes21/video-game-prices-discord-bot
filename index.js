require('dotenv').config();
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	console.log(`Retrieved ${file} and will join it with ${commandsPath}`);

	if ('data' in command) {
		client.commands.set(command.data.name, command);
		console.log(`Successfully inserted ${command.data.name} to Collection`);
	} else {
		console.warn(`The command at ${filePath} does not have a "data" property`);
	}
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	console.log(`Retrieved ${interaction.commandName}`);

	let command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName}`);
		return;
	}
	else {
		await command.execute(interaction);
	}
})