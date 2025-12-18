const { embedLength, EmbedBuilder } = require('discord.js')
const fs = require('fs')

function config(interaction, path, filedoesntexist){
    const t = interaction.options.get('time').value
    const isvalidtime = /^((2[0-3])|([01]\d)):[0-5]\d$/.test(t)
    embedcolor = interaction.options.get('embedcolor')?.value
    if (embedcolor === undefined){
        embedcolor = '#008000'
    }
    const isvalidcolor = /^#(\d|[A-Fa-f]){6}$/.test(embedcolor)
    embed = new EmbedBuilder()
    if (!isvalidtime){
        embed.addFields({
            name: 'Invalid time',
            value: `${t} is not a valid time in HH:MM format`
        })
    }
    if (!isvalidcolor){
        embed.addFields({
            name: 'Invalid color code',
            value: `${embedcolor} is not a valid hex color code`
        })
        interaction.reply({embeds: [embed]})
    }
    if (isvalidtime && isvalidcolor){
        var exams
        if (filedoesntexist){
            exams = []
        }
        else{
            exams = JSON.parse(fs.readFileSync(path)).exams
        }
        const data = { 'exams': exams, 'time':{'hour':parseInt(t.slice(0, 2)), 'minute':parseInt(t.slice(3, 5))}, 'inadvance':parseInt(interaction.options.get('days_in_advance').value), 'channelid':interaction.channelId, 'embedcolor':Number(`0x${embedcolor.slice(1, 7)}`)}
        fs.writeFileSync(path, JSON.stringify(data))
        embed
        .setColor(0x00C000)
        .setTitle('Config')
        .addFields({
            name: '',
            value: `Successfully configured bot to send reminders at ${t}, ${interaction.options.get('days_in_advance').value} days in advance, with the color ${embedcolor.toUpperCase()}.`
        })
    }
    else{
        embed
        .setColor(0xD80000)
        .setTitle('Error')
    }
    interaction.reply({embeds: [embed]})
}
module.exports = {config}