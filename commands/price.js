require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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

        // interaction.reply(`/price is called, gamename: ${gameName.value}`);

        try {
            let response = await axios.get(`https://api.isthereanydeal.com/v01/game/prices/?key=${process.env.ISTHEREANYDEALS_TOKEN}&plains=${gameName.value}`);
            let price = response.data;
            let gameData = price.data;

            // console.log(price);
            // console.log(gameData);
            // console.log(gameData[gameName.value].list);

            const pricesMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${gameName.value} Current Prices`);

            interaction.reply({ embeds: [pricesMessage] });

        }
        catch (error) {
            console.log(error);
        }
    }
};