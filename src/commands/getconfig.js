const fs = require('fs')

function getconfig(interaction, path){
    cf = JSON.parse(fs.readFileSync(path))
    interaction.reply(`I am configured to send a reminder at ${cf.time.hour < 10 ? '0' : ''}${cf.time.hour}:${cf.time.minute < 10 ? '0' : ''}${cf.time.minute}, ${cf.inadvance} days in advance, with the color of #${cf.embedcolor.toString(16).toUpperCase()}, in <#${cf.channelid}>`)
}
module.exports = {getconfig}