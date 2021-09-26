const Discord = require('discord.js');

const config = require('./config.json');

const Client = new Discord.Client({disableEveryone: true});
const keepAlive = require ("./server")

const fs = require('fs');

const xpfile = require('./xp.json')

Client.on("ready", async () => {
    console.log(`${Client.user.username} đang hoạt động!`)

   Client.user.setActivity("Discord", {type: "STREAMING", url: "https://www.twitch.tv/discord"})
});

Client.on("guildMemberAdd", member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'CHANNEL NAME')
    welcomeChannel.send (`welcome! ${member}`)
})

Client.on("guildMemberRemove", member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'CHANNEL NAME')
    welcomeChannel.send (`Goodbye! ${member}`)
})

Client.on("message", async message => {
    if(message.author.Client || message.channel.type === "dm") return;

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1)

    if(cmd === `${prefix}hi`) {
        return message.channel.send("Hello There!")
    }

    if(cmd === `${prefix}hello`) {
        return message.reply("hello, how are you?")
    }

})

Client.on("message" ,function(message) {
    if(message.author.Client) return;
    var addXP = Math.floor(Math.random() * 10); 

    if(!xpfile[message.author.id]) {
        xpfile[message.author.id] = {
           xp: 0,
           level: 1,
           reqxp: 100
        }

       fs.writeFile("./xp.json",JSON.stringify(xpfile),function(err){ 
        if(err) console.log(err)
       })
    }

    xpfile[message.author.id].xp += addXP

    if(xpfile[message.author.id].xp > xpfile[message.author.id].reqxp){
        xpfile[message.author.id].xp -= xpfile[message.author.id].reqxp 
        xpfile[message.author.id].reqxp *= 2 
        xpfile[message.author.id].reqxp = Math.floor(xpfile[message.author.id].reqxp) 
        xpfile[message.author.id].level += 1 
     
        message.reply("You Are Now Level **"+xpfile[message.author.id].level+"**!").then( 
            msg=>msg.delete({timeout: "10000"})
        )

    }

    fs.writeFile("./xp.json",JSON.stringify(xpfile),function(err){
        if(err) console/log(err)
    })

    if(message.content.startsWith("p=level")){
        let user = message.mentions.users.first() || message.author

        let embed = new Discord.MessageEmbed()
        .setTitle("Level Card")
        .setColor("GREEN")
        .addField("Level: ",xpfile[user.id].level)
        .addField("XP: ", xpfile[user.id].xp+"/"+xpfile[user.id].reqxp)
        .addField("XP Required: ",xpfile[user.id].reqxp)
        message.channel.send(embed)
    }
}) 

Client.on("message", async message => {
    if(message.author.Client || message.channel.type === "dm") return;

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1)

    if(message.content.startsWith("p=changelog")){
        let user = message.mentions.users.first() || message.author

        let embed = new Discord.MessageEmbed()
        .setTitle("Change Log")
        .setColor("RED")
        .addField("Version:", "ALPHA 1.1")
        .addField("What's new? ", "1.Add changelog command!")
        message.channel.send(embed)
    }
})
        
keepAlive()
Client.login(process.env.token);

