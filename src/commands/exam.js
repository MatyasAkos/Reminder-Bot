import { toDate } from ".."

function exam(){
    var cf = JSON.parse(fs.readFileSync(path))
    
    const maxexam = 50
    const subjectlen = 30
    const typelen = 30
    const topiclen = 256
    const date = toDate(interaction.options.get('date').value)

    if (cf.exams !== undefined && cf.exams.length >= maxexam){
        interaction.reply(`You cannot have more than ${maxexam} exams at a time!`)
    }
    else if (date === null){
        interaction.reply(`Invalid date!`)
    }
    else if (interaction.options.get('subject').value.length > subjectlen){
        interaction.reply(`Subject name longer than ${subjectlen} characters!`)
    }
    else if (interaction.options.get('type').value.length > typelen){
        interaction.reply(`Exam type name longer than ${typelen} characters!`)
    }
    else if ((interaction.options.get('topic')?.value || '').length > topiclen){
        interaction.reply(`Topic longer than ${topiclen} characters!`)
    }
    else{
        cf.exams.push({
            'year': date.getFullYear(),
            'month': date.getMonth(),
            'day': date.getDate(),
            'subject': interaction.options.get('subject').value,
            'type': interaction.options.get('type').value,
            'topic': interaction.options.get('topic')?.value || '',
            'notifiedabout': false
        })
        cf.exams.sort((a, b) => {
            return new Date(a.year, a.month, a.day).getTime() - new Date(b.year, b.month, b.day).getTime()
        })
        fs.writeFileSync(path, JSON.stringify(cf))
        interaction.reply(`Successfully added new ${interaction.options.get('type').value} on ${date.getFullYear()}.${date.getMonth() < 9 ? '0' : ''}${date.getMonth() + 1}.${date.getDate() < 10 ? '0' : ''}${date.getDate()}. in subject ${interaction.options.get('subject').value}${(interaction.options.get('topic') || '') === '' ? '' : ` with the topic of: ${interaction.options.get('topic').value}`}`)
    }
}
export {exam}