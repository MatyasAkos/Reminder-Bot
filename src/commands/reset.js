function reset(){
    fs.rmSync(path)
    interaction.reply('Reset the config')
}
module.exports = {reset}