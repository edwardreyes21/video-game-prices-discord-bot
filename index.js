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

	if (data in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.warn('The command at ${filePath} does not have a "data" property');
	}
}

client.on('message', async message => {
	if (message.content.startsWith('/prices')) {
		let input = message.content.slice(8);
		console.log(message.content);
		/*let apiKey = process.env.ISTHEREANYDEALS_TOKEN;
		let url = 'https://api.isthereanydeal.com/v01/game/prices/?key=${apiKey}&plains=${gameName}'
		try {
			let res = await axios.get()
		} catch(error) {
			console.error(error);
		}*/
	}
})