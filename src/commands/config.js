const Database = require('better-sqlite3')
const { EmbedBuilder } = require('discord.js')
const { spam } = require('../other')
const db = new Database('database.db', {fileMustExist: true})

function config(interaction, rowexists){
    const t = interaction.options.get('time').value
    const isvalidtime = /^((2[0-3])|([01]\d)):[0-5]\d$/.test(t)
    embedcolor = interaction.options.get('embedcolor')?.value
    embed = new EmbedBuilder()
    if (!isvalidtime){
        embed.addFields({
            name: 'Invalid time',
            value: `${t} is not a valid time in HH:MM format`
        })
    }   
    const isvalidcolor = /^#(\d|[A-Fa-f]){6}$/.test(embedcolor)
    if (!isvalidcolor && embedcolor !== undefined){
        embed.addFields({
            name: 'Invalid color code',
            value: `${embedcolor} is not a valid hex color code`
        })
    }
    if(interaction.options.get('days_in_advance').value < 0){
        embed.addFields({
            name: 'Invalid value for days in advance',
            value: 'Days in advance mustn\'t be negative'
        })
    }
    if (isvalidtime && (isvalidcolor || embedcolor === undefined)){
        const values = {
            guildid: interaction.guildId,
            hour: parseInt(t.slice(0, 2)),
            minute: parseInt(t.slice(3, 5)),
            inadvance: parseInt(interaction.options.get('days_in_advance').value),
            channelid: interaction.channelId,
            embedcolor: Number(`0x${embedcolor?.slice(1, 7)}`) || 0x008000
        }
        if (rowexists){
            if (embedcolor === undefined){
                db
                .prepare('UPDATE servers SET hour = @hour, minute = @hour, inadvance = @inadvance, channelid = @channelid WHERE guildid = @guildid')
                .run(values)
            }
            else{
                db
                .prepare('UPDATE servers SET hour = @hour, minute = @hour, inadvance = @inadvance, channelid = @channelid, embedcolor = @embedcolor WHERE guildid = @guildid')
                .run(values)
            }
        }
        else{
            db
            .prepare('INSERT INTO servers VALUES (@guildid, @hour, @minute, @inadvance, @channelid, @embedcolor)')
            .run(values)
        }
        if(embedcolor === undefined){
            embedcolor = db
            .prepare('SELECT embedcolor FROM servers WHERE guildid = @guildid')
            .get(values)
            .embedcolor
        }
        embed
        .setColor(0x00C000)
        .setTitle('Config')
        .setDescription(`Successfully configured bot to send reminders at ${t}, ${interaction.options.get('days_in_advance').value} days in advance, with the color #${spam('0', 6 - embedcolor.toString(16).length)}${embedcolor.toString(16).toUpperCase()}.`)
    }
    else{
        embed
        .setColor(0xD80000)
        .setTitle('Error')
    }
    interaction.reply({embeds: [embed]})
}
module.exports = {config}