const { embedLength } = require('discord.js')
const fs = require('fs')

function config(interaction, path, filedoesntexist){
    const t = interaction.options.get('time').value
    if (/^((2[0-3])|([01]\d)):[0-5]\d$/.test(t)){
        embedcolor = interaction.options.get('embedcolor')?.value
        if (embedcolor === undefined){
            embedcolor = '#008000'
        }
        if(!/^#(\d|[A-Fa-f]){6}$/.test(embedcolor)){
            interaction.reply(`Invalid color: ${embedcolor}`)
        }
        else{
            var exams
            if (filedoesntexist){
                exams = []
            }
            else{
                exams = JSON.parse(fs.readFileSync(path)).exams
            }
            const data = { 'exams': exams, 'time':{'hour':parseInt(t.slice(0, 2)), 'minute':parseInt(t.slice(3, 5))}, 'inadvance':parseInt(interaction.options.get('days_in_advance').value), 'channelid':interaction.channelId, 'embedcolor':Number(`0x${embedcolor.slice(1, 7)}`)}
            fs.writeFileSync(path, JSON.stringify(data))
            interaction.reply(`Successfully configured bot to send reminders at ${t}, ${interaction.options.get('days_in_advance').value} days in advance, with the color ${embedcolor.toUpperCase()}.`)
        }
    }
    else{
        interaction.reply(`Invalid time: ${t}`)
    }
}
module.exports = {config}