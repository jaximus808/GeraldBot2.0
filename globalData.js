const fs = require("fs")

const {fetch, Request, Response } = require("undici") 



const commands = {}

const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
for(const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    commands[command.name] = command
}

module.exports = {
    commands: commands,
    fetch: fetch
}