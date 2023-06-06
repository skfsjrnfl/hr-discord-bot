//Requirements
const fs = require('node:fs');
const path = require('node:path');
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  Events,
} = require("discord.js");
const DB = require("./db_api.js");
const COMMAND = require("./command.js");
const { token } = require("./config-dev.json"); //commit 시 수정

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();
client.btnInteractions = new Collection();
client.smInteractions = new Collection();
client.waitingRooms = new Collection();

//resister commands to bot
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('name' in command && 'execute' in command) {
		client.commands.set(command.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//resister interactions to bot
const btnInteractionsPath = path.join(__dirname, 'interactions/btn');
const btnInteractionFiles = fs.readdirSync(btnInteractionsPath).filter(file => file.endsWith('.js'));
for (const file of btnInteractionFiles) {
	const filePath = path.join(btnInteractionsPath, file);
	const interaction = require(filePath);
	if ('name' in interaction && 'execute' in interaction) {
		client.btnInteractions.set(interaction.name, interaction);
	} else {
		console.log(`[WARNING] The interaction at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const smInteractionsPath = path.join(__dirname, 'interactions/selectMenu');
const smInteractionFiles = fs.readdirSync(smInteractionsPath).filter(file => file.endsWith('.js'));
for (const file of smInteractionFiles) {
	const filePath = path.join(smInteractionsPath, file);
	const interaction = require(filePath);
	if ('name' in interaction && 'execute' in interaction) {
		client.smInteractions.set(interaction.name, interaction);
	} else {
		console.log(`[WARNING] The interaction at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//resister event to bot
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
// client.once(Events.ClientReady,(c)=>{
//   c.guilds.cache.at(1).roles.create({
//     name:"Super Cool Blue People",
//     reason:"test",
//   }).then(console.log)
//   .catch(console.error);
//  }
// )
//Run Bot
client.login(token);