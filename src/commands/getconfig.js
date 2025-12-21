const Database = require('better-sqlite3')
const { EmbedBuilder } = require('discord.js')
const { spam } = require('../other')
const db = new Database('database.db', {fileMustExist: true})

function getconfig(interaction){
    const conf = db
    .prepare('SELECT * FROM servers WHERE guildid = ?')
    .get(interaction.guildId)
    const embed = new EmbedBuilder()
    .setTitle('Config')
    .setColor(0x00C000)
    .setDescription(`I am configured to send a reminder at ${conf.hour < 10 ? '0' : ''}${conf.hour}:${conf.minute < 10 ? '0' : ''}${conf.minute}, ${conf.inadvance} days in advance, with the color of #${spam('0', 6 - conf.embedcolor.toString(16).length)}${conf.embedcolor.toString(16).toUpperCase()}, in <#${conf.channelid}>`)
    interaction.reply({embeds: [embed]})
}
module.exports = {getconfig}