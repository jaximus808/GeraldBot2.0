if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const {fetch, Request, Response} = require("undici")

const { Client, Intents} = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const prefix = ".";

const globaldata = require("./globalData")

const commands = globaldata.commands

client.on("messageCreate", message =>
{
    if(!message.content.startsWith(prefix) || message.author.bot) return


    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if(!commands[command]) return;
    commands[command].execute(message,args,globaldata);
})


client.once("ready", () =>
{
    console.log("Gerald Online");
})


client.login(process.env.DISCORD_API_KEY);