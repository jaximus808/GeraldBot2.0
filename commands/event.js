module.exports = {
    name: 'event',
    admin:true,
    description: 'Creates an event and updates the event database. This event will be posted on the annoucements and on our website. \n__Format__: .event {name} {mm/dd/yyyy} {imageLink: (if no image put "none")} {website?: (y or n)} {description: format as [ text ] ex: [ new competition! ]} \n__Return__: success or failure',
    execute: async (message,args, globaldata) =>
    {
        //
        if(args.length < 5) return message.channel.send("You don't have the correct amount of arguments!")
        if(args[3] != "y" && args[3] != "n") return message.channel.send("command only accept y or n parameters for website arg!")
        const parsedStrings = args[1].split('/');

        //annouce to server first

        if(parsedStrings.length != 3) return message.channel.send("Invalid Date Format!")

        const date = new Date(parsedStrings[2],parsedStrings[0],parsedStrings[1])

        if(date === "Invalid Date") return message.channel.send("Invalid Date Format!")



        if(args[4] != "[" || args[args.length-1] != "]") return message.channel.send("You misformatted your description");


        var formatDescription = args[5]; 
        for(let i = 6; i <args.length-1; i++)
        {
            formatDescription+= " "+args[i]
        }

        message.guild.channels.cache.get("978568896560898048").send(`__**ANNOUNCEMENT**__\nEvent: **${args[0]}**\nDate: ${date.toString()}\nDescription: ${formatDescription}\n${(args[3].trim().toLowerCase() === "none")? "":args[2]}\n<@&961950733689847818>`)

        if(args[3] === 'n' ) return message.channel.send("Annoucement made!");  
        try 
        {
            const res = await globaldata.fetch(`${process.env.masterServer}/api/createEvents/`, 
            {
                method:"POST",
                body:JSON.stringify({
                    pass:process.env.masterServerPass,
                    name: args[0],
                    description: formatDescription,
                    date: date.toString(),
                    imageLink: args[2]
    
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
        catch(e)
        {
            console.log(e)
            message.channel.send("There was a fetch error, please try again");
        }
        
    }
}