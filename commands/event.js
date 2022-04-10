module.exports = {
    name: 'event',
    admin:true,
    description: 'Creates an event and updates the event database. This event will be posted on the annoucements and on our website. \n__Format__: .event {name} {mm/dd/yyyy} {description} {website?: (y or n)} {imageLink: (make this a properURL)} \n__Return__: success or failure',
    execute: async (message,args, globaldata) =>
    {
        //
        const res = await globaldata.fetch(`${process.env.masterServer}/api/createEvents/`, 
        {
            method:"POST",
            body:JSON.stringify({
                pass:process.env.masterServerPass
            }),
            headers:
            {
                "Content-Type":"application/json"
            }
        })
        const data = await res.json(); 
        console.log(data);
    }
}