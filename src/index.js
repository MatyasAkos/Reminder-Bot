require('dotenv').config()

const { Message, EmbedBuilder } = require('discord.js')
const { Client, IntentsBitField, messageLink } = require('discord.js')
const fs = require('fs')
const client = new Client({
    intents: []
})

client.on('clientReady', () => {
    reminder()
})

client.on('interactionCreate', (interaction) => {
    if(interaction.isChatInputCommand()){
        if (interaction.commandName === 'help'){
            const embed = new EmbedBuilder()
                .setTitle('Help')
                .addFields(
                    { name: 'About the bot:', value: 'This bot reminds the server about upcoming exams at a specified time, a certain number of days before the exam.'}
                )
                .addFields(
                    { name: 'Commands:', value: '- **/config:** Has to be run before the bot can be used. Specifies when the bot should send it\'s reminders. The bot will send it\'s reminders in the same channel, that /config was last ran.\n- **/getconfig:** Displays all config data. If the channel in which the bot was configured is deleted, the config settings go with it.\n- **/exam:** Adds a new exam to the list of exams. Specifying a date that is already over will be assumed to be next year.\n- **/list:** Lists all upcoming exams along whith their ids.\n- **/remove:** Removes the exam with the specified id.\n- **/help:** Displays this message.'}
                )
                .setColor(0xFF6600)
            interaction.reply({embeds: [embed] })
        }
        else{
            const path = `config/${interaction.guildId}.json`
            fs.access(path, (filedoesntexist) => {
                if (interaction.commandName === 'config'){
                    const t = interaction.options.get('time').value
                    if (/^(2[0-4])|([01]\d):[0-5]\d$/.test(t)){
                        var exams
                        if (filedoesntexist){
                            exams = []
                        }
                        else{
                            exams = JSON.parse(fs.readFileSync(path)).exams
                        }
                        const data = { 'exams': exams, 'time':{'hour':parseInt(t.slice(0, 2)), 'minute':parseInt(t.slice(3, 5))}, 'inadvance':parseInt(interaction.options.get('days_in_advance').value), 'channelid':interaction.channelId }
                        fs.writeFileSync(path, JSON.stringify(data))
                        interaction.reply(`Successfully configured bot to send reminders at ${t}, ${interaction.options.get('days_in_advance').value} days in advance.`)
                    }
                    else{
                        interaction.reply(`Invalid time: ${t}`)
                    }
                }
                else if (filedoesntexist){
                    interaction.reply('Please configure the bot first!')
                }
                else if (interaction.commandName === 'exam'){
                    var cf = JSON.parse(fs.readFileSync(path))
                    
                    const maxexam = 50
                    const subjectlen = 30
                    const typelen = 30
                    const topiclen = 256
                    const date = toDate(interaction.options.get('date').value)
    
                    if (cf.exams !== undefined && cf.exams.length >= maxexam){
                        interaction.reply(`You cannot have more than ${maxexam} exams at a time!`)
                    }
                    else if (date === null){
                        interaction.reply(`Invalid date!`)
                    }
                    else if (interaction.options.get('subject').value.length > subjectlen){
                        interaction.reply(`Subject name longer than ${subjectlen} characters!`)
                    }
                    else if (interaction.options.get('type').value.length > typelen){
                        interaction.reply(`Exam type name longer than ${typelen} characters!`)
                    }
                    else if ((interaction.options.get('topic')?.value || '').length > topiclen){
                        interaction.reply(`Topic longer than ${topiclen} characters!`)
                    }
                    else{
                        cf.exams.push({
                            'year': date.getFullYear(),
                            'month': date.getMonth(),
                            'day': date.getDate(),
                            'subject': interaction.options.get('subject').value,
                            'type': interaction.options.get('type').value,
                            'topic': interaction.options.get('topic')?.value || '',
                            'notifiedabout': false
                        })
                        cf.exams.sort((a, b) => {
                            return new Date(a.year, a.month, a.day).getTime() - new Date(b.year, b.month, b.day).getTime()
                        })
                        fs.writeFileSync(path, JSON.stringify(cf))
                        interaction.reply(`Successfully added new ${interaction.options.get('type').value} on ${date.getFullYear()}.${date.getMonth() < 9 ? '0' : ''}${date.getMonth() + 1}.${date.getDate() < 10 ? '0' : ''}${date.getDate()}. in subject ${interaction.options.get('subject').value}${(interaction.options.get('topic') || '') === '' ? '' : ` with the topic of: ${interaction.options.get('topic').value}`}`)
                    }
                }
                else if(interaction.commandName === 'list'){
                    cf = JSON.parse(fs.readFileSync(path))
                    if(cf.exams.length === 0){
                        interaction.reply('There are no upcoming exams.')
                    }
                    else{
                        result = ''
                        for (let i = 0; i < cf.exams.length; i++) {
                            result += `${i + 1}. ${cf.exams[i].type} in ${cf.exams[i].subject} on ${cf.exams[i].year > new Date().getFullYear() ? `${cf.exams[i].year}.` : ''}${cf.exams[i].month < 9 ? '0' : ''}${cf.exams[i].month + 1}.${cf.exams[i].day < 10 ? '0' : ''}${cf.exams[i].day}.${(cf.exams[i].topic || '') === '' ? '' : ` with the topic of: ${cf.exams[i].topic}`}${cf.exams.length !== i - 1 ? '\n' : ''}`
                        }
                        interaction.reply(result)
                    }
                }
                else if(interaction.commandName === 'remove'){
                    cf = JSON.parse(fs.readFileSync(path))
                    if(cf.exams.length === 0){
                        interaction.reply('There are no upcoming exams.')
                    }
                    else if(cf.exams.length < interaction.options.get('id').value){
                        interaction.reply('There aren\'t that many exams.')
                    }
                    else if(interaction.options.get('id') <= 0){
                        interaction.reply('Id mustn\'t be 0 or negative')
                    }
                    else{
                        const subj = cf.exams[interaction.options.get('id').value - 1].subject
                        cf.exams.splice(interaction.options.get('id').value - 1, 1)
                        fs.writeFileSync(path, JSON.stringify(cf))
                        interaction.reply(`Successfully removed ${subj} exam.`)
                    }
                }
                else if(interaction.commandName === 'getconfig'){
                    cf = JSON.parse(fs.readFileSync(path))
                    interaction.reply(`I am configured to send a reminder at ${cf.time.hour < 10 ? '0' : ''}${cf.time.hour}:${cf.time.minute < 10 ? '0' : ''}${cf.time.minute}, ${cf.inadvance} days in advance in <#${cf.channelid}>`)
                }
            })
        }
    }
})

function toDate(datestr){
    if (!/^(\d{2}\.){2}$/.test(datestr)){
        return null
    }
    today = new Date()
    m = parseInt(parseInt(datestr.slice(0, 2))) - 1
    d = parseInt(parseInt(datestr.slice(3, 5)))
    y = today.getFullYear()
    date = new Date(y, m, d)
    if (y === date.getFullYear() && m === date.getMonth() && d === date.getDate()){
        if(today.getMonth() >= date.getMonth() && today.getDate() >= date.getDate()){
            date = new Date(y + 1, m, d)
        }
        return date
    }
    else{
        return null
    }
}

async function reminder() {
    const path = 'config'
    const timeout = 10000
    setTimeout(() => {
        fs.readdir(path, (err, files) => {
            files.forEach(async (file) => {
                cf = JSON.parse(fs.readFileSync(`${path}/${file}`))
                chexists = await channelExists(cf.channelid)
                if (!chexists){
                    fs.rmSync(`${path}/${file}`)
                }
                else{
                    i = 0
                    result = '@everyone'
                    notify = false
                    while(i < cf.exams.length){
                        const examtime = new Date(cf.exams[i].year, cf.exams[i].month, cf.exams[i].day, cf.time.hour, cf.time.minute, 0)
                        const remindtime = new Date(cf.exams[i].year, cf.exams[i].month, cf.exams[i].day - cf.inadvance, cf.time.hour, cf.time.minute, 0)
                        const now = new Date()
                        if (remindtime.getTime() <= now.getTime() && !cf.exams[i].notifiedabout) {
                            result += (`\nThere is an upcoming ${cf.exams[i].subject} ${cf.exams[i].type} on ${cf.exams[i].year > new Date().getFullYear() ? `${cf.exams[i].year}.` : ''}${cf.exams[i].month < 9 ? '0' : ''}${cf.exams[i].month + 1}.${cf.exams[i].day < 10 ? '0' : ''}${cf.exams[i].day}.${(cf.exams[i].topic || '') === '' ? '' : ` with the topic of: ${cf.exams[i].topic}`}`)
                            cf.exams[i].notifiedabout = true
                            notify = true
                        }
                        if (examtime.getTime() <= now.getTime()){
                            cf.exams.splice(i, 1)
                        }
                        else{
                            i++
                        }
                    }
                    if (notify){
                        client.channels.cache.get(cf.channelid).send(result)
                    }
                    fs.writeFileSync(`${path}/${file}`, JSON.stringify(cf))
                }
            })
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