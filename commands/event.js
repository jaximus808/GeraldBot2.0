module.exports = {
    name: 'event',
    admin:true,
    description: 'Creates an event and updates the event database. This event will be posted on the annoucements and on our website. \n__Format__: .event {name} {description} {mm/dd/yyyy} {imageLink: (if no image put "none")} {website?: (y or n)}  \n__Return__: success or failure',
    execute: async (message,args, globaldata) =>
    {
        //
        if(args.length != 5) return message.channel.send("You don't have the correct amount of arguments!")
        if(args[4] != "y" && args[4] != "n") return message.channel.send("command only accept y or n parameters for website arg!")
        const parsedStrings = args[2].split('/');

        console.log(parsedStrings)

        //annouce to server first

        if(parsedStrings.length != 3) return message.channel.send("Invalid Date Format!")

        const date = new Date(parsedStrings[2],parsedStrings[0],parsedStrings[1])

        if(date === "Invalid Date") return message.channel.send("Invalid Date Format!")



        message.guild.channels.cache.get("961951660085755925").send(`__**ANNOUNCEMENT**__\nEvent: **${args[0]}**\nDate: ${date.toString()}\nDescription: ${args[1]}\n${(args[3].trim().toLowerCase() === "none")? "":args[3]}\n<@&961950733689847818>`)

        if(args[4] === 'n' ) return message.channel.send("Annoucement made!");  
        const res = await globaldata.fetch(`${process.env.masterServer}/api/createEvents/`, 
        {
            method:"POST",
            body:JSON.stringify({
                pass:process.env.masterServerPass,
                name: args[0],
                description: args[1],
                date: date.toString(),
                imageLink: args[3]

            }),
            headers:
            {
                "Content-Type":"application/json"
            }
        })
        const data = await res.json(); 

        if(data.error) message.channel.send("Error adding your event :"+data.message );
        else message.channel.send(`Event successfully added! Your event id is: ${data.message}`)
    }
}