const Database = require('better-sqlite3')
const db = new Database('database.db', {fileMustExist: true})

console.log('Starting migration 001_edit_command...')
db.exec(`
    ALTER TABLE servers
    ADD edit TEXT
    `)

db.close()
console.log('Successfully finished migration 001_edit_command!')