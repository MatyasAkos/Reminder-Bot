const { EmbedBuilder } = require('discord.js')
const fs = require('fs')

function reset(interaction, path){
    fs.rmSync(path)
    const embed = new EmbedBuilder()
    .setColor(0x00C000)
    .setTitle('Reset the config')
    .addFields({
        name: '',
        value: `Successfully reset the config`
    })
    interaction.reply({embeds: [embed]})
}
module.exports = {reset}