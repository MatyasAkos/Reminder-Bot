function config(){
    const t = interaction.options.get('time').value
    if (/^((2[0-3])|([01]\d)):[0-5]\d$/.test(t)){
        var exams
        if (filedoesntexist){
            exams = []
        }
        else{
            exams = JSON.parse(fs.readFileSync(path)).exams
        }
        const data = { 'exams': exams, 'time':{'hour':parseInt(t.slice(0, 2)), 'minute':parseInt(t.slice(3, 5))}, 'inadvance':parseInt(interaction.options.get('days_in_advance').value), 'channelid':interaction.channelId }
        fs.writeFileSync(path, JSON.stringify(data))
        interaction.reply(`Successfully configured bot to send reminders at ${t}, ${interaction.options.get('days_in_advance').value} days in advance.`)
    }
    else{
        interaction.reply(`Invalid time: ${t}`)
    }
}
module.exports = {config}