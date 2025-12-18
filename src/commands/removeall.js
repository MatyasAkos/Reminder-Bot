const { EmbedBuilder } = require('discord.js')
const fs = require('fs')

function removeall(interaction, path){
    cf = JSON.parse(fs.readFileSync(path))
    cf.exams = []
    fs.writeFileSync(path, JSON.stringify(cf))
    const embed = new EmbedBuilder()
    .setColor(0x00C000)
    .setTitle('Removed all exams')
    .addFields({
        name: '',
        value: `Successfully removed all exams`
    })
    interaction.reply({embeds: [embed]})
}
module.exports = {removeall}