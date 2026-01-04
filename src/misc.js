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
    const pingsarr = args.pings.split(',')
    if (pingsarr[0] === ''){
        return ''
    }
    for (const pingid of pingsarr) {
        if (pingid.slice(0, 1) === '&'){
            const roleid = pingid.slice(1, pingid.length)
            if (args.guild.roles.cache.find(x => x.id === roleid) !== undefined){
                if(args.ping){
                    result += `<@${pingid}> `
                }
                else{
                    result += `@${args.guild.roles.cache.get(roleid).name} `
                }
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

module.exports = {spam, channelExists, listPings, isPermitted}