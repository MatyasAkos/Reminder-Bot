const Database = require('better-sqlite3')
const { EmbedBuilder } = require('discord.js')
const { spam } = require('../misc')
const db = new Database('database.db', {fileMustExist: true})

function config(interaction, rowexists){
    const time = interaction.options.get('time')?.value
    const isvalidtime = /^((2[0-3])|([01]\d)):[0-5]\d$/.test(time)
    const embedcolor = interaction.options.get('embedcolor')?.value
    const inadvance = interaction.options.get('days_in_advance')?.value
    let errors = ''
    if (time !== undefined && !isvalidtime){
        errors += `- **${time}** is not a valid **time** in HH:MM format\n`
    }   
    if (inadvance !== undefined && inadvance < 0){
        errors += '- **Days in advance** mustn\'t be **negative**\n'
    }
    if (!rowexists){
        if(time === undefined){
            errors += '- **Time** must be specified when first configing the bot\n'
        }
        if(inadvance === undefined){
            errors += '- **Days in advance** must be specified when first configing the bot\n'
        }
    }
    else{
        const oldchannelid = db
        .prepare('SELECT channelid FROM servers WHERE guildid = ?')
        .get(interaction.guildId)
        .channelid
        if ((time === undefined) && (inadvance === undefined) && (embedcolor === undefined) && (oldchannelid === interaction.channelId)){
            errors += '- At least one change must be specified\n'
        }
    }
    const isvalidcolor = /^#(\d|[A-Fa-f]){6}$/.test(embedcolor)
    if (embedcolor !== undefined && !isvalidcolor){
        errors += `- **${embedcolor}** is not a valid hex **color** code\n`
    }
    let embed = new EmbedBuilder()
    if (errors === ''){
        const values = {
            guildid: interaction.guildId,
            hour: parseInt(time?.slice(0, 2)),
            minute: parseInt(time?.slice(3, 5)),
            inadvance: inadvance,
            channelid: interaction.channelId,
            embedcolor: embedcolor !== undefined ? Number(`0x${embedcolor?.slice(1, 7)}`) : 0x008000
        }
        if (rowexists){
            db
            .prepare(`UPDATE servers SET ${time === undefined ? '' : 'hour = @hour, minute = @minute,'} ${inadvance === undefined ? '' : 'inadvance = @inadvance,'} ${embedcolor === undefined ? '' : 'embedcolor = @embedcolor,'} channelid = @channelid WHERE guildid = @guildid`)
            .run(values)
        }
        else{
            db
            .prepare('INSERT INTO servers VALUES (@guildid, @hour, @minute, @inadvance, @channelid, @embedcolor, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)')
            .run(values)
        }
        const newvalues = db
        .prepare('SELECT hour, minute, inadvance, embedcolor FROM servers WHERE guildid = @guildid')
        .get(values)
        embed
        .setColor(0x00C000)
        .setTitle('Config')
        .setDescription(`Successfully configured bot to send reminders at **${newvalues.hour < 10 ? '0' : ''}${newvalues.hour}:${newvalues.minute < 10 ? '0' : ''}${newvalues.minute}**, **${newvalues.inadvance}** day${newvalues.inadvance !== 1 ? 's' : ''} in advance, with the color **#${spam('0', 6 - newvalues.embedcolor.toString(16).length)}${newvalues.embedcolor.toString(16).toUpperCase()}**`)
    }
    else{
        embed
        .setColor(0xD80000)
        .setTitle('Error')
        .setDescription(errors)
    }
    interaction.reply({embeds: [embed]})
}
module.exports = {config}