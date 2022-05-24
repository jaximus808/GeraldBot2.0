module.exports = {
    name: 'eventdelete',
    admin:true,
    description: 'Deletes an event that is stored in the database which are displayed on the website. The id can be found from the confirmation message the bot gives.  \n__Format__: .deleteEvent {ID} \n__Return__: success or failure',
    execute: async (message,args, globaldata) =>
    {
       if(args.length != 1 ) return message.channel.send("Your message is formatted incorrectly")

       try 
        {
            const res = await globaldata.fetch(`${process.env.masterServer}/api/removeEvent/`, 
            {
                method:"POST",
                body:JSON.stringify({
                    pass:process.env.masterServerPass,
                    _id: args[0]
    
                }),
                headers:
                {
                    "Content-Type":"application/json"
                }
            })
            const data = await res.json(); 
    
            if(data.error) message.channel.send("Error deleting event: "+data.message );
            else message.channel.send(`Event deleted successfully!`)
        }
        catch(e)
        {
            console.log(e)
            message.channel.send("There was a fetch error, please try again");
        }
        
    }
}