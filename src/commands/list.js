function list(){
    cf = JSON.parse(fs.readFileSync(path))
    if(cf.exams.length === 0){
        interaction.reply('There are no upcoming exams.')
    }
    else{
        result = ''
        for (let i = 0; i < cf.exams.length; i++) {
            result += `${i + 1}. ${cf.exams[i].type} in ${cf.exams[i].subject} on ${cf.exams[i].year > new Date().getFullYear() ? `${cf.exams[i].year}.` : ''}${cf.exams[i].month < 9 ? '0' : ''}${cf.exams[i].month + 1}.${cf.exams[i].day < 10 ? '0' : ''}${cf.exams[i].day}.${(cf.exams[i].topic || '') === '' ? '' : ` with the topic of: ${cf.exams[i].topic}`}${cf.exams.length !== i - 1 ? '\n' : ''}`
            if(result.length > 1000 || i === cf.exams.length - 1){
                interaction.reply(result)
                result = ''
            }
        }
    }
}
export {list}