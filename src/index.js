require('dotenv').config()

const {Client, EmbedBuilder} = require('discord.js')
const fs = require('fs')
const { help } = require('./commands/help')
const { config } = require('./commands/config')
const { exam } = require('./commands/exam')
const { list } = require('./commands/list')
const { remove } = require('./commands/remove')
const { getconfig } = require('./commands/getconfig')
const { removeall } = require('./commands/removeall')
const { reset } = require('./commands/reset')
const client = new Client({
    intents: []
})

client.on('clientReady', () => {
    const folderName = 'config'
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
    reminder()
})

client.on('interactionCreate', (interaction) => {
    if(interaction.isChatInputCommand()){
        if (interaction.commandName === 'help'){
            help(interaction)
        }
        else{
            const path = `config/${interaction.guildId}.json`
            fs.access(path, (filedoesntexist) => {
                if (interaction.commandName === 'config'){
                    config(interaction, path, filedoesntexist)
                }
                else if (filedoesntexist){
                    interaction.reply('Please configure the bot first!')
                }
                else if (interaction.commandName === 'exam'){
                    exam(interaction, path)
                }
                else if(interaction.commandName === 'list'){
                    list(interaction, path, client)
                }
                else if(interaction.commandName === 'remove'){
                    remove(interaction, path)
                }
                else if(interaction.commandName === 'getconfig'){
                    getconfig(interaction, path)
                }
                else if(interaction.commandName === 'removeall'){
                    removeall(interaction, path)
                }
                else if(interaction.commandName === 'reset'){
                    reset(interaction, path)
                }
            })
        }
    }
})

function reminder() {
    const path = 'config'
    const timeout = 1000
    setTimeout(() => {
        fs.readdir(path, async (err, files) => {
            for (i = 0; i < files.length; i++) {
                cf = JSON.parse(fs.readFileSync(`${path}/${files[i]}`))
                chexists = await channelExists(cf.channelid)
                if (!chexists){
                    fs.rmSync(`${path}/${files[i]}`)
                }
                else{
                    embed = new EmbedBuilder()
                    .setTitle('Upcoming exams')
                    .setColor(cf.embedcolor)
                    nm = ''
                    val = ''
                    const ping = '@everyon3'
                    fieldscnt = 0
                    charcnt = 0
                    result = []
                    j = 0
                    sendmsg = false
                    while(j < cf.exams.length){
                        const examtime = new Date(cf.exams[j].year, cf.exams[j].month, cf.exams[j].day, cf.time.hour, cf.time.minute, 0)
                        const remindtime = new Date(cf.exams[j].year, cf.exams[j].month, cf.exams[j].day - cf.inadvance, cf.time.hour, cf.time.minute, 0)
                        const now = new Date()
                        if (remindtime.getTime() <= now.getTime() && !cf.exams[j].notifiedabout) {
                            sendmsg = true
                            nm = `${cf.exams[j].type} in ${cf.exams[j].subject} on ${cf.exams[j].year > new Date().getFullYear() ? `${cf.exams[j].year}.` : ''}${cf.exams[j].month < 9 ? '0' : ''}${cf.exams[j].month + 1}.${cf.exams[j].day < 10 ? '0' : ''}${cf.exams[j].day}.`
                            val = cf.exams[j].topic || ''
                            if(fieldscnt === 25 || charcnt + nm.length + val.length > 6000){
                                result.push(embed)
                                embed = new EmbedBuilder()
                                .setColor(cf.embedcolor)
                                .addFields({name: nm, value: val})
                                fieldscnt = 0
                                charcnt = nm.length + val.length
                            }
                            else{
                                embed.addFields({name: nm, value: val})
                                charcnt += nm.length + val.length
                                fieldscnt++
                            }
                            cf.exams[j].notifiedabout = true
                        }
                        if (examtime.getTime() <= now.getTime()){
                            cf.exams.splice(j, 1)
                        }
                        else{
                            j++
                        }
                    }
                    console.log(result)
                    if(sendmsg){
                        result.push(embed)
                        client.channels.cache.get(cf.channelid).send({content: ping, embeds: [result[0]]})
                        for (let k = 1; k < result.length; k++) {
                            client.channels.cache.get(cf.channelid).send({embeds: [result[k]]})
                        }
                        fs.writeFileSync(`${path}/${files[i]}`, JSON.stringify(cf))
                    }
                }
            }
            reminder()
        })
    }, timeout)
}

async function channelExists(channelId) {
    try {
        await client.channels.fetch(channelId)
        return true
    } 
    catch {
        return false
    }
}


client.login(process.env.TOKEN)