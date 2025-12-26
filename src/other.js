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
        console.log(pingid)
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

module.exports = {spam, channelExists, listPings: listPings}