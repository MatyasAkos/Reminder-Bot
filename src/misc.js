const { PermissionsBitField } = require("discord.js")

function spam(string, times){
    let result = ''
    for (let i = 0; i < times; i++) {
        result += string
    }
    return result
}

function channelExists(client, channelid) {
    return client.channels.fetch(channelid)
    .then(() => {
        return true
    })
    .catch(() => {
        return false
    })
}

async function listPings(args){
    let result = ''
    let pingsarr
    if (typeof args.pings === 'string'){
        pingsarr = args.pings.split(',')
    }
    else{
        pingsarr = args.pings
    }
    if (pingsarr[0] === ''){
        return ''
    }
    for (let pingid of pingsarr) {
        if (pingid[0] === '<'){
            pingid = pingid.slice(2, pingid.length - 1)
        }
        if (pingid[0] === '&'){
            const roleid = pingid.slice(1, pingid.length)
            if (args.guild.roles.cache.find(x => x.id === roleid) !== undefined){
                if(args.ping){
                    result += `<@${pingid}> `
                }
                else{
                    result += `@${args.guild.roles.cache.get(roleid).name} `
                }
            }
            else{
                result += `<@${pingid}> `
            }
        }
        else{
            if(args.ping){
                result += `<@${pingid}> `
            }
            else{
                const user = await args.client.users.fetch(pingid)
                result += `@${user.globalName ?? user.username} `
            }
        }
    }
    return result
}

function isPermitted(args){
    if (args.member.permissions.has(PermissionsBitField.Flags.Administrator)){
        return true
    }
    else if (args.rowexists){
        const roleid = args.db
        .prepare(`SELECT ${args.command} AS role FROM servers WHERE guildid = ?`)
        .get(args.guildid)
        .role
        return roleid !== null && (roleid === '@everyone' || args.member.roles.cache.has(roleid))
    }
    else{
        return false
    }
}

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
    const list = string?.match(/<@&?\d+>/g)
    if (list === undefined){
        return ''
    }
    let result = ''
    for (let i = 0; i < list.length; i++) {
        result += list[i].match(/&?\d+/)
        if (i < (list.length - 1)){
            result += ','
        }
    }
    return result
}

async function isValidPing(ping, client){
    try{
        if (ping[0] !== '&'){
            await client.users.fetch(ping)
        }
        return true
    }
    catch{
        return false
    }
}

module.exports = {spam, channelExists, listPings, isPermitted, toDate, toCsv, isValidPing}