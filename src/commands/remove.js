function remove(){
    cf = JSON.parse(fs.readFileSync(path))
    if(cf.exams.length === 0){
        interaction.reply('There are no upcoming exams.')
    }
    else if(cf.exams.length < interaction.options.get('id').value){
        interaction.reply('There aren\'t that many exams.')
    }
    else if(interaction.options.get('id') <= 0){
        interaction.reply('Id mustn\'t be 0 or negative')
    }
    else{
        const subj = cf.exams[interaction.options.get('id').value - 1].subject
        cf.exams.splice(interaction.options.get('id').value - 1, 1)
        fs.writeFileSync(path, JSON.stringify(cf))
        interaction.reply(`Successfully removed ${subj} exam.`)
    }
}
export {remove}