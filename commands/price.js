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
        let gameObj = interaction.options.get('gamename');

        let gameName = gameObj.value;
        gameName = gameName.replace(/\s/g, '').toLowerCase();

        try {
            let response = await axios.get(`https://api.isthereanydeal.com/v01/game/prices/?key=${process.env.ISTHEREANYDEALS_TOKEN}&plains=${gameName}`);
            let price = response.data;
            let gameData = price.data;

            console.log(price);
            console.log(gameData);
            console.log(gameData[gameName].urls.game);

            let priceList = gameData[gameName].list;
            console.log(priceList);

            const pricesMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${gameName} Current Prices`)
                .setURL(gameData[gameName].urls.game);

            for (const priceobj of priceList) {
                pricesMessage.addFields(
                    { name: `${priceobj.price_new} at ${priceobj.shop.name}`, value: `${priceobj.url}` }
                );
            }

            interaction.reply({ embeds: [pricesMessage] });

        }
        catch (error) {
            console.log(error);
        }
    }
};