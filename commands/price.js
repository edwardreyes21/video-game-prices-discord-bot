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

        let userInput = gameObj.value;
        userInput = userInput.replace(/\s/g, '').toLowerCase();

        let plainName = "", giveError = false;
        try {
            let plainObj = await axios.get(`https://api.isthereanydeal.com/v02/game/plain/?key=${process.env.ISTHEREANYDEALS_TOKEN}&title=${userInput}`);
            if ('plain' in plainObj.data.data) {
                plainName = plainObj.data.data.plain;
            }
            else {
                giveError = true;
            }
        }
        catch (error) {
            console.log(error);
        }

        if (giveError || plainName.length === 0) {
            const errorMessage = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Failed to Retrieve Game`)
                .addFields( 
                    { name: `Sorry, but we were not able to find the game you were looking for.`, value: `Perhaps try a more specific title?` }
                );

            interaction.reply({ embeds: [errorMessage] });
        } else {
            try {
                let response = await axios.get(`https://api.isthereanydeal.com/v01/game/prices/?key=${process.env.ISTHEREANYDEALS_TOKEN}&plains=${plainName}`);
                let price = response.data;
                let gameData = price.data;
    
                console.log(price);
                console.log(gameData);
                console.log(gameData[plainName].urls.game);
    
                let priceList = gameData[plainName].list;
                console.log(priceList);
    
                const pricesMessage = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`${plainName} Current Prices`)
                    .setURL(gameData[plainName].urls.game);
    
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
    }
};