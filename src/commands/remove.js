const { EmbedBuilder } = require('@discordjs/builders')
const fs = require('fs')

function remove(interaction, path){
    cf = JSON.parse(fs.readFileSync(path))
    if(cf.exams.length === 0){
        const embed = new EmbedBuilder()
        .setColor(0xD80000)
        .setTitle('No upcoming exams')
        .addFields({
            name: '',
            value: 'There are no upcoming exams.'
        })
        interaction.reply({embeds: [embed]})
    }
    else if(cf.exams.length < interaction.options.get('id').value){
        embed = new EmbedBuilder()
        .setColor(0xD80000)
        .setTitle('There aren\'t that many exams')
        if(cf.exams.length === 1){
            embed.addFields({
                name: '',
                value: 'There is only 1 exam'
            })
        }
        else{
            embed.addFields({
                name: '',
                value: `There are only ${cf.exams.length} exams`
            })
        }
        interaction.reply({embeds: [embed]})
    }
    else if(interaction.options.get('id').value <= 0){
        const embed = new EmbedBuilder()
        .setColor(0xD80000)
        .setTitle('Invalid id')
        .addFields({
            name: '',
            value: 'Id mustn\'t be 0 or negative'
        })
        interaction.reply({embeds: [embed]})
    }
    else{
        const subj = cf.exams[interaction.options.get('id').value - 1].subject
        cf.exams.splice(interaction.options.get('id').value - 1, 1)
        fs.writeFileSync(path, JSON.stringify(cf))
        const embed = new EmbedBuilder()
        .setColor(0x00C000)
        .setTitle('Removed exam')
        .addFields({
            name: '',
            value: `Successfully removed ${subj} exam`
        })
        interaction.reply({embeds: [embed]})
    }
}
module.exports = {remove}