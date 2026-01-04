const Database = require('better-sqlite3')
const { EmbedBuilder } = require('discord.js')
const db = new Database('database.db')

function reset(interaction){
    db
    .prepare('DELETE FROM servers WHERE guildid = ?')
    .run(interaction.guildId)
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