const Database = require("better-sqlite3");
const { EmbedBuilder } = require("discord.js");
const db = new Database('database.db', {fileMustExist: true})

function manageroles(interaction){
    let embed = new EmbedBuilder()
    const commandlist = ['config', 'exam', 'getconfig', 'help', 'list', 'remove', 'removeall', 'reset']
    let changelist = []
    let changedcommandslist = []
    let error = false
    for (const command of commandlist) {
        let val = interaction.options.get(command)?.value
        if (val !== undefined){
            if (val.match(/^(<@&\d{1,25}>)|(@everyone)|(admin)$/)){
                if (val === 'admin'){
                    changelist.push(`${command} = NULL`)
                }
                else{
                    if (val !== '@everyone'){
                        val = val.slice(3, val.length - 1)
                    }
                    changelist.push(`${command} = \'${val}\'`)
                }
                changedcommandslist.push(` /${command}`)
            }
            else{
                error = true
                embed
                .setTitle('Error')
                .setColor(0xD80000)
                .addFields({name: `Invalid role for ${command}`, value: `\`${val}\` is not a valid role`})
            }
        }
    }
    if (changedcommandslist.length === 0){
        embed
        .setTitle('Error')
        .setColor(0xD80000)
        .addFields({name: 'No roles specified', value: 'At least one role must me specified'})
    }
    else if (!error){
        db
        .prepare(`UPDATE servers SET ${changelist} WHERE guildid = ?`)
        .run(interaction.guildId)
        embed
        .setTitle('Success')
        .setColor(0x00C000)
        .setDescription(`Successfully set role${changedcommandslist.length > 1 ? 's' : ''} for${changedcommandslist}`)
    }
    interaction.reply({embeds: [embed]})
}
module.exports = {manageroles}