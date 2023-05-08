const { Events } = require('discord.js');
const { prefix } = require("../config-dev.json");

module.exports ={
    name: Events.InteractionCreate,
    async execute(interaction) {
		if (interaction.isButton()){
            const command = interaction.client.interactions.get(interaction.customId);
            if (!command){
                return;
            }
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${command}`);
                console.error(error);
            }
        }
	},
};