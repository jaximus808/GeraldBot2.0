module.exports = {
    name: 'help',
    admin:false,
    description: 'Gives a list of current commands and their uses.\n__Format__: .help\n__Return__: {command} {description} {return}',
    execute: (message,args, globaldata) =>
    {
        var commandsString = "";
                
        const fs = require("fs")
        const commands = globaldata.commands
        

        for(const command in commands)
        {
            if(message.channel.id == "961950642665037834" || !commands[command].admin)
            {
                commandsString += `\n .**${commands[command].name}** \n ${(commands[command].admin)? "(admin)" : "" } ${commands[command].description}`
            }
        }
        message.channel.send(`>>> SUP IM GERALD, my commands are: ${commandsString}`)
    }
}