const Database = require('better-sqlite3')
const { EmbedBuilder } = require('discord.js')
const db = new Database('database.db', {fileMustExist: true})

function removeall(interaction){
    db
    .prepare('DELETE FROM exams WHERE guildid = ?')
    .run(interaction.guildId)
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