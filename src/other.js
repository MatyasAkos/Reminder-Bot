function spam(string, times){
    result = ''
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

module.exports = {spam, channelExists}