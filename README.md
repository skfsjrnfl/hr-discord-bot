# HR-discord-bot
This is a Discord bot built using the Discord.js library. The bot is designed to assist in organizing teams for games or other activities.

## Prerequisites
Node.js
Discord account with permission to create bots
Discord application with bot created and token obtained
## Installation
1. Clone the repository
2. Run npm install to install the required dependencies
3/ Create a config-dev.json file in the root directory of the project with the following format:
```
{
  "token": "<your bot token here>"
}
```
4. Run the bot using node index.js
## Features
### Team Generation
Users can use the command !team to generate teams based on the number of people currently in the voice channel. The bot will only generate teams for even numbers of people, and will randomly assign team members.

### Dice Rolling
Users can use the command !dice to roll a virtual die and receive a random number between 1 and 99.

### Reroll Button
When the bot generates teams, it will also send a message with two buttons to the text channel for voting. If users want to reroll the teams, they can click the "reroll" button, and the bot will generate new teams. The other buttons are used to vote for the winning team.

### Help Command
Users can use the command !help to get a list of available commands and their descriptions.

## Code Structure
The bot is built using the Discord.js library and consists of a single index.js file. The file defines a Client object, which connects to the Discord API and listens for various events such as message creation and button clicks. The main functionality of the bot is contained within the event listeners, which use the Discord.js library to interact with the Discord API and provide the desired functionality. The bot uses Discord's slash commands and buttons to interact with users.

## Future Improvements
Allow users to customize the number of teams and team size
Add more games to generate teams for
Implement error handling to handle edge cases
Add logging to track user interactions and bot events
## Acknowledgments
[Discord.js](https://discord.js.org/) library
[OpenAI](https://openai.com/) for training the ChatGPT language model used to generate this readme.
