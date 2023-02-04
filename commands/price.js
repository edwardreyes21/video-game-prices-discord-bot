const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('Usage: /price {gameName} {region}')
    .addStringOption(option =>
        option.setName('gamename')
            .setDescription('The name of the video game')
            .setRequired(true)),
    async execute(interaction) {
        let gameName = interaction.options.get('gamename');
        console.log(gameName.value);

        await interaction.reply(`/price is called`);
    }
};