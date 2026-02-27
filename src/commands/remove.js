const { EmbedBuilder } = require('@discordjs/builders')
const Database = require('better-sqlite3')
const db = new Database('database.db', {fileMustExist: true})

function remove(interaction){
    const examcnt = db
    .prepare('SELECT COUNT(*) AS cnt FROM exams WHERE guildid = ?')
    .get(interaction.guildId).cnt
    if(examcnt === 0){
        const embed = new EmbedBuilder()
        .setColor(0xD80000)
        .setTitle('No upcoming exams')
        .setDescription('There are no upcoming exams')
        interaction.reply({embeds: [embed]})
    }
    else if(examcnt < interaction.options.get('id').value){
        embed = new EmbedBuilder()
        .setColor(0xD80000)
        .setTitle('There aren\'t that many exams')
        if(examcnt === 1){
            embed.setDescription('There is only 1 exam')
        }
        else{
            embed.addFields({
                name: '',
                value: `There are only ${examcnt} exams`
            })
        }
        interaction.reply({embeds: [embed]})
    }
    else if(interaction.options.get('id').value <= 0){
        const embed = new EmbedBuilder()
        .setColor(0xD80000)
        .setTitle('Invalid id')
        .setDescription('Id mustn\'t be 0 or negative')
        interaction.reply({embeds: [embed]})
    }
    else{
        const info = db
        .prepare('SELECT id, subject FROM (SELECT id, subject, ROW_NUMBER() OVER (ORDER BY year, month, day) AS rownum FROM exams WHERE guildid = ?) WHERE rownum = ?')
        .get(interaction.guildId, interaction.options.get('id').value)
        db
        .prepare('DELETE FROM exams WHERE id = @id')
        .run(info)
        const embed = new EmbedBuilder()
        .setColor(0x00C000)
        .setTitle('Removed exam')
        .addFields({
            name: '',
            value: `Successfully removed ${info.subject} exam`
        })
        interaction.reply({embeds: [embed]})
    }
}
module.exports = {remove}