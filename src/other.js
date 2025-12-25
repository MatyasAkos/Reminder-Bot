function spam(string, times){
    let result = ''
    for (let i = 0; i < times; i++) {
        result += string
    }
    return result
}

function channelExists(client, channelId) {
    return client.channels.fetch(channelId)
    .then(() => {
        return true
    })
    .catch(() => {
        return false
    })
}

async function listRoles(args){
    let result = ''
    const rolesarr = args.roles.split(',')
    if (rolesarr[0] === ''){
        return ''
    }
    for (const roleid of rolesarr) {
        if(args.ping){
            result += `<@&${roleid}> `
        }
        else{
            result += `@${await args.guild.roles.cache.get(roleid).name} `
        }
    }
    return result
}

module.exports = {spam, channelExists, listRoles}