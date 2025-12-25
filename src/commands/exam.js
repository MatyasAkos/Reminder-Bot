const { EmbedBuilder } = require('@discordjs/builders')
const Database = require('better-sqlite3')
const { listRoles } = require('../other')
const db = new Database('database.db', {fileMustExist: true})

async function exam(interaction){
    const maxexam = 50
    const subjectlen = 30
    const typelen = 30
    const topiclen = 256
    const date = toDate(interaction.options.get('date').value)

    const isnottoomanyexams = db.prepare('SELECT COUNT(*) AS value FROM exams WHERE guildid = ?').get(interaction.guildId).value < maxexam
    const isvaliddate = date !== null
    const isnottoolongsubjectlen = interaction.options.get('subject').value.length <= subjectlen
    const isnottoolongtypelen = interaction.options.get('type').value.length <= typelen
    const isnottoolongtopiclen = (interaction.options.get('topic')?.value || '').length <= topiclen
    const isvalidroles = /^(<@&\d+>)( <@&\d+>)*$/.test(interaction.options.get('special_roles')?.value || '<@&0>')

    let embed = new EmbedBuilder()

    if (!isnottoomanyexams){
        embed.addFields({
            name: 'Too many exams',
            value: `You cannot have more than ${maxexam} exams at a time!`
        })
    }
    if (!isvaliddate){
        embed.addFields({
            name: 'Invalid date',
            value: `${interaction.options.get('date').value} is not a valid date in the MM.DD. format!`
        })
    }
    if (!isnottoolongsubjectlen){
        embed.addFields({
            name: 'Subject name too long',
            value: `Subject name longer than ${subjectlen} characters!`
        })
    }
    if (!isnottoolongtypelen){
        embed.addFields({
            name: 'Exam type name too long',
            value: `Exam type name longer than ${typelen} characters!`
        })
    }
    if (!isnottoolongtopiclen){
        embed.addFields({
            name: 'Topic name too long',
            value: `Topic longer than ${topiclen} characters!`
        })
    }
    if (!isvalidroles){
        embed.addFields({
            name: 'Invalid list of roles',
            value: 'List of roles did not match the specification'
        })
    }
    if (isnottoomanyexams && isvaliddate && isnottoolongsubjectlen && isnottoolongtypelen && isnottoolongtopiclen && isvalidroles){
        const now = new Date()
        const time = db
        .prepare('SELECT inadvance, hour, minute FROM servers WHERE guildid = ?')
        .get(interaction.guildId)
        const notifytime = new Date(date.getFullYear(), date.getMonth(), date.getDate() - time.inadvance, time.hour, time.minute, 0)
        const rolescsv = toCsv(interaction.options.get('special_roles')?.value)
        db
        .prepare('INSERT INTO exams (year, month, day, subject, type, topic, notifiedabout, guildid, roles) VALUES (@year, @month, @day, @subject, @type, @topic, @notifiedabout, @guildid, @roles)')
        .run({
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            subject: interaction.options.get('subject').value,
            type: interaction.options.get('type').value,
            topic: interaction.options.get('topic')?.value || '',
            notifiedabout: now.getTime() > notifytime.getTime() ? 1 : 0,
            guildid: interaction.guildId,
            roles: rolescsv
        })
        embed
        .setColor(0x00C000)
        .setTitle('Successfully added new exam')
        .addFields(
            {
                name: 'type',
                value: interaction.options.get('type').value
            },
            {
                name: 'date',
                value: `${date.getFullYear()}.${date.getMonth() < 9 ? '0' : ''}${date.getMonth() + 1}.${date.getDate() < 10 ? '0' : ''}${date.getDate()}.`
            },
            {
                name: 'subject',
                value: interaction.options.get('subject').value
            },
        )
        if(interaction.options.get('topic') !== null){  
            embed.addFields({
                name: 'topic',
                value: interaction.options.get('topic').value
            })
        }
        if(interaction.options.get('special_roles') !== null){  
            embed.addFields({
                name: 'pings',
                value: await listRoles({roles: rolescsv, ping: false, guild: interaction.guild})
            })
        }
    }
    else{
        embed
        .setColor(0xD80000)
        .setTitle('Error')
    }
    interaction.reply({embeds: [embed]})
}
module.exports = {exam}

function toDate(datestr){
    if (!/^(\d{2}\.){2}$/.test(datestr)){
        return null
    }
    const today = new Date()
    const m = parseInt(parseInt(datestr.slice(0, 2))) - 1
    const d = parseInt(parseInt(datestr.slice(3, 5)))
    const y = today.getFullYear()
    let date = new Date(y, m, d)
    if (y === date.getFullYear() && m === date.getMonth() && d === date.getDate()){
        if(today.getMonth() > date.getMonth() || (today.getMonth() === date.getMonth() && today.getDate() > date.getDate())){
            date = new Date(y + 1, m, d)
        }
        return date
    }
    else{
        return null
    }
}

function toCsv(string){
    const list = string?.match(/<@&\d+>/g)
    if (list === undefined){
        return ''
    }
    let result = ''
    for (let i = 0; i < list.length; i++) {
        result += list[i].match(/\d+/)
        if (i < (list.length - 1)){
            result += ','
        }
    }
    return result
}