const Database = require("better-sqlite3")
const { EmbedBuilder } = require("discord.js")
const db = new Database('database.db', {fileMustExist: true})

async function listroles(interaction){
    const roles = db
    .prepare('SELECT config, exam, getconfig, help, list, listroles, manageroles, remove, removeall, reset FROM servers WHERE guildid = ?')
    .get(interaction.guildId)
    let result = ''
    for (const [key, value] of Object.entries(roles)) {
        if (value === '@everyone'){
            result += `/${key}: everyone\n`
        }
        else{
            const rolename = (await interaction.guild.roles.fetch(value)).name
            result += `/${key}: ${rolename === undefined ? 'admins only' : `@${rolename}`}\n`
        }
    }
    const embed = new EmbedBuilder()
    .setTitle('List of commands and roles')
    .setColor(0x00C000)
    .setDescription(result)
    interaction.reply({embeds: [embed]})
}
module.exports = {listroles}