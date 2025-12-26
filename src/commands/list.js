const Database = require('better-sqlite3');
const { EmbedBuilder } = require('discord.js');
const { listPings } = require('../misc');
const db = new Database('database.db', {fileMustExist: true, readonly: true})

async function list(interaction, client){
    const conf = db
    .prepare('SELECT * FROM servers WHERE guildid = ?')
    .get(interaction.guildId)
    const exams = db
    .prepare('SELECT * FROM exams WHERE guildid = ? ORDER BY year, month, day')
    .all(interaction.guildId)
    if(exams.length === 0){
        const embed = new EmbedBuilder()
        .setColor(conf.embedcolor)
        .setTitle('No upcoming exams')
        .setDescription('There are no upcoming exams')
        interaction.reply({embeds: [embed]})
    }
    else{
        const title = 'List of exams'
        let embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(conf.embedcolor)
        let fieldscnt = 0
        let charcnt = title.length
        let nm = ''
        let val = ''
        let result = []
        await client.channels.fetch(interaction.channelId)
        for (let i = 0; i < exams.length; i++) {
            nm = `${i + 1}. ${exams[i].type} in ${exams[i].subject} on ${exams[i].year > new Date().getFullYear() ? `${exams[i].year}.` : ''}${exams[i].month < 9 ? '0' : ''}${exams[i].month + 1}.${exams[i].day < 10 ? '0' : ''}${exams[i].day}.`
            val = `${exams[i].topic || ''}\n${await listPings({pings: exams[i].pings, ping: false, guild: interaction.guild, client: client})}`
            if(fieldscnt === 25 || charcnt + nm.length + val.length > 6000){
                result.push(embed)
                embed = new EmbedBuilder()
                .setColor(conf.embedcolor)
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