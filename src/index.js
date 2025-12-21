require('dotenv').config()
const {Client, EmbedBuilder} = require('discord.js')
const { help } = require('./commands/help')
const { config } = require('./commands/config')
const { exam } = require('./commands/exam')
const { list } = require('./commands/list')
const { remove } = require('./commands/remove')
const { getconfig } = require('./commands/getconfig')
const { removeall } = require('./commands/removeall')
const { reset } = require('./commands/reset')
const Database = require('better-sqlite3')
const { channelExists } = require('./other')
const client = new Client({
    intents: []
})
const db = new Database('database.db', {fileMustExist: true})
const timeout = process.env.TIMEOUT

client.on('clientReady', () => {
    reminder()
})

client.on('interactionCreate', (interaction) => {
    if(interaction.isChatInputCommand()){
        if (interaction.commandName === 'help'){
            help(interaction)
        }
        else{
            const rowexists = db
            .prepare('SELECT COUNT(*) AS value FROM servers WHERE guildid = ?')
            .get(interaction.guildId).value === 1
            if (interaction.commandName === 'config'){
                config(interaction, rowexists)
            }
            else if (!rowexists){
                const embed = new EmbedBuilder()
                .setColor(0xD80000)
                .setTitle('The bot isn\'t configured yet')
                .setDescription('Please configure the bot first!')
                interaction.reply({embeds: [embed]})
            }
            else if (interaction.commandName === 'exam'){
                exam(interaction)
            }
            else if(interaction.commandName === 'list'){
                list(interaction, client)
            }
            else if(interaction.commandName === 'remove'){
                remove(interaction)
            }
            else if(interaction.commandName === 'getconfig'){
                getconfig(interaction)
            }
            else if(interaction.commandName === 'removeall'){
                removeall(interaction)
            }
            else if(interaction.commandName === 'reset'){
                reset(interaction)
            }
        }
    }
})

function reminder() {
    setTimeout(() => {
        db.transaction(() => {(async () => {
            const confs = db
            .prepare('SELECT * FROM servers')
            .all()
            for (i = 0; i < confs.length; i++) {
                const chexists = await channelExists(client, confs[i].channelid)
                if (!chexists){
                    db
                    .prepare('DELETE FROM servers WHERE guildid = ?')
                    .run(confs[i].guildId)
                }
                else{
                    embed = new EmbedBuilder()
                    .setTitle('Upcoming exams')
                    .setColor(confs[i].embedcolor)
                    const exams = db
                    .prepare('SELECT * FROM exams WHERE guildid = ?')
                    .all(confs[i].guildid)
                    nm = ''
                    val = ''
                    const ping = '@everyon3'
                    fieldscnt = 0
                    charcnt = 0
                    result = []
                    sendmsg = false
                    for(let j = 0; j < exams.length; j++){
                        const examtime = new Date(exams[j].year, exams[j].month, exams[j].day, confs[i].hour, confs[i].minute, 0)
                        const remindtime = new Date(exams[j].year, exams[j].month, exams[j].day - confs[i].inadvance, confs[i].hour, confs[i].minute, 0)
                        const now = new Date()
                        if (remindtime.getTime() <= now.getTime() && (exams[j].notifiedabout === 0)) {
                            sendmsg = true
                            nm = `${exams[j].type} in ${exams[j].subject} on ${exams[j].year > new Date().getFullYear() ? `${exams[j].year}.` : ''}${exams[j].month < 9 ? '0' : ''}${exams[j].month + 1}.${exams[j].day < 10 ? '0' : ''}${exams[j].day}.`
                            val = exams[j].topic || ''
                            if(fieldscnt === 25 || charcnt + nm.length + val.length > 6000){
                                result.push(embed)
                                embed = new EmbedBuilder()
                                .setColor(confs[i].embedcolor)
                                .addFields({name: nm, value: val})
                                fieldscnt = 0
                                charcnt = nm.length + val.length
                            }
                            else{
                                embed.addFields({name: nm, value: val})
                                charcnt += nm.length + val.length
                                fieldscnt++
                            }
                            db
                            .prepare('UPDATE exams SET notifiedabout = ? WHERE id = ?')
                            .run(1, exams[j].id)
                        }
                        if (now.getTime() > examtime.getTime()){
                            db
                            .prepare('DELETE FROM exams WHERE id = ?')
                            .run(exams[j].id)
                        }
                    }
                    if(sendmsg){
                        result.push(embed)
                        client.channels.cache.get(confs[i].channelid).send({content: ping, embeds: [result[0]]})
                        for (let j = 1; j < result.length; j++) {
                            client.channels.cache.get(confs[i].channelid).send({embeds: [result[j]]})
                        }
                    }
                }
            }
        })()})()
        reminder()
    }, timeout)
}


client.login(process.env.TOKEN)