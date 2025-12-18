const fs = require('fs')

function getconfig(interaction, path){
    cf = JSON.parse(fs.readFileSync(path))
    interaction.reply(`I am configured to send a reminder at ${cf.time.hour < 10 ? '0' : ''}${cf.time.hour}:${cf.time.minute < 10 ? '0' : ''}${cf.time.minute}, ${cf.inadvance} days in advance, with the color of #${spam('0', 6 - cf.embedcolor.toString(16).length)}${cf.embedcolor.toString(16).toUpperCase()}, in <#${cf.channelid}>`)
}
module.exports = {getconfig}

function spam(string, times){
    result = ''
    for (let i = 0; i < times; i++) {
        result += string
    }
    return result
}