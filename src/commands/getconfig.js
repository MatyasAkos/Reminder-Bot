function getconfig(){
    cf = JSON.parse(fs.readFileSync(path))
    interaction.reply(`I am configured to send a reminder at ${cf.time.hour < 10 ? '0' : ''}${cf.time.hour}:${cf.time.minute < 10 ? '0' : ''}${cf.time.minute}, ${cf.inadvance} days in advance in <#${cf.channelid}>`)
}
module.exports = {getconfig}