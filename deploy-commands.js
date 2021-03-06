// Deploy commands' data (name, description, ...) to guild
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId } = require("./config.json");

let token;
try {
	token = require("./token.json");
} catch {
	token = process.env.token;
}

const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);


// simple command examples: https://github.com/discordjs/guide/blob/main/code-samples/creating-your-bot/command-handling/commands/options-info.js
const registerCommands = async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log("Successfully registered application (/) commands.");
	} catch (error) {
		console.error(error);
	}
};

registerCommands();