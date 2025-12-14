function reset(){
    fs.rmSync(path)
    interaction.reply('Reset the config')
}
export {reset}