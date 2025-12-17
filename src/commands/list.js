const { EmbedBuilder } = require('discord.js');
const fs = require('fs')

async function list(interaction, path, client){
    cf = JSON.parse(fs.readFileSync(path))
    if(cf.exams.length === 0){
        interaction.reply('There are no upcoming exams.')
    }
    else{
        const title = 'List of exams'
        embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(cf.embedcolor)
        fieldscnt = 0
        charcnt = title.length
        nm = ''
        val = ''
        result = []
        //nextname = `${cf.exams[i].type} in ${cf.exams[i].subject} on ${cf.exams[i].year > new Date().getFullYear() ? `${cf.exams[i].year}.` : ''}${cf.exams[i].month < 9 ? '0' : ''}${cf.exams[i].month + 1}.${cf.exams[i].day < 10 ? '0' : ''}${cf.exams[i].day}.`
        //nextvalue = (cf.exams[i].topic || '') === '' ? '' : ` with the topic of: ${cf.exams[i].topic}`
        await client.channels.fetch(interaction.channelId)
        for (let i = 0; i < cf.exams.length; i++) {
            //next = `${i + 1}. ${cf.exams[i].type} in ${cf.exams[i].subject} on ${cf.exams[i].year > new Date().getFullYear() ? `${cf.exams[i].year}.` : ''}${cf.exams[i].month < 9 ? '0' : ''}${cf.exams[i].month + 1}.${cf.exams[i].day < 10 ? '0' : ''}${cf.exams[i].day}.${(cf.exams[i].topic || '') === '' ? '' : ` with the topic of: ${cf.exams[i].topic}`}\n`
            nm = `${cf.exams[i].type} in ${cf.exams[i].subject} on ${cf.exams[i].year > new Date().getFullYear() ? `${cf.exams[i].year}.` : ''}${cf.exams[i].month < 9 ? '0' : ''}${cf.exams[i].month + 1}.${cf.exams[i].day < 10 ? '0' : ''}${cf.exams[i].day}.`
            val = cf.exams[i].topic || ''
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
        }
        result.push(embed)
        interaction.reply({embeds: [result[0]]})
        for (let i = 1; i < result.length; i++) {
            client.channels.cache.get(interaction.channelId).send({embeds: [result[i]]})
        }
    }
}
module.exports = {list}