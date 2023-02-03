const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('Usage: /price {gameName} {region}'),
    async execute(interaction) {
        await interaction.reply(`/price is called`);
    }
};