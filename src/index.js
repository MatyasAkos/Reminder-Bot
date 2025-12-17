require('dotenv').config()

const {Client} = require('discord.js')
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
    const timeout = 60000
    setTimeout(() => {
        fs.readdir(path, async (err, files) => {
            for (i = 0; i < files.length; i++) {
                cf = JSON.parse(fs.readFileSync(`${path}/${files[i]}`))
                chexists = await channelExists(cf.channelid)
                if (!chexists){
                    fs.rmSync(`${path}/${files[i]}`)
                }
                else{
                    j = 0
                    const ping = '@everyone'
                    result = ping
                    next = ''
                    while(j < cf.exams.length){
                        result += next
                        next = ''
                        const examtime = new Date(cf.exams[j].year, cf.exams[j].month, cf.exams[j].day, cf.time.hour, cf.time.minute, 0)
                        const remindtime = new Date(cf.exams[j].year, cf.exams[j].month, cf.exams[j].day - cf.inadvance, cf.time.hour, cf.time.minute, 0)
                        const now = new Date()
                        if (remindtime.getTime() <= now.getTime() && !cf.exams[j].notifiedabout) {
                            if(j < cf.exams.length){
                                next = `\nThere is an upcoming ${cf.exams[j].subject} ${cf.exams[j].type} on ${cf.exams[j].year > new Date().getFullYear() ? `${cf.exams[j].year}.` : ''}${cf.exams[j].month < 9 ? '0' : ''}${cf.exams[j].month + 1}.${cf.exams[j].day < 10 ? '0' : ''}${cf.exams[j].day}.${(cf.exams[j].topic || '') === '' ? '' : ` with the topic of: ${cf.exams[j].topic}`}`
                            }
                            cf.exams[j].notifiedabout = true
                        }
                        if (examtime.getTime() <= now.getTime()){
                            cf.exams.splice(j, 1)
                        }
                        else{
                            j++
                        }
                        if(result.length + next.length > 2000){
                            client.channels.cache.get(cf.channelid).send(result)
                            result = ''
                        }
                    }
                    result += next
                    if (result !== ping && result !== ''){
                        client.channels.cache.get(cf.channelid).send(result)
                    }
                    fs.writeFileSync(`${path}/${files[i]}`, JSON.stringify(cf))
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


client.login(process.env.TOKEN)//