const fs = require('fs')

async function list(interaction, path, client){
    cf = JSON.parse(fs.readFileSync(path))
    if(cf.exams.length === 0){
        interaction.reply('There are no upcoming exams.')
    }
    else{
        result = ''
        msgcnt = 0;
        next = `$1. ${cf.exams[0].type} in ${cf.exams[0].subject} on ${cf.exams[0].year > new Date().getFullYear() ? `${cf.exams[0].year}.` : ''}${cf.exams[0].month < 9 ? '0' : ''}${cf.exams[0].month + 1}.${cf.exams[0].day < 10 ? '0' : ''}${cf.exams[0].day}.${(cf.exams[0].topic || '') === '' ? '' : ` with the topic of: ${cf.exams[0].topic}`}\n`
        await client.channels.fetch(interaction.channelId)
        for (let i = 1; i < cf.exams.length + 1; i++) {
            result += next
            if (i < cf.exams.length - 1)
            next = `${i + 1}. ${cf.exams[i].type} in ${cf.exams[i].subject} on ${cf.exams[i].year > new Date().getFullYear() ? `${cf.exams[i].year}.` : ''}${cf.exams[i].month < 9 ? '0' : ''}${cf.exams[i].month + 1}.${cf.exams[i].day < 10 ? '0' : ''}${cf.exams[i].day}.${(cf.exams[i].topic || '') === '' ? '' : ` with the topic of: ${cf.exams[i].topic}`}\n`
            if(result.length + next.length > 2000 || i === cf.exams.length - 1){
                if (msgcnt === 0){
                    interaction.reply(result)
                }
                else{
                    client.channels.cache.get(interaction.channelId).send(result)
                }
                msgcnt++
                result = ''
            }
        }
    }
}
module.exports = {list}