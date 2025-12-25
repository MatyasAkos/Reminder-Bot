const Database = require('better-sqlite3')
const fs = require('fs')

fs.access('database.db', (err) => {
    if(!err){
        console.log('Database already exists!')
    }
    else{
        console.log('Creating database...')
        const db = new Database('database.db')
        db.exec(`
            CREATE TABLE servers
            (
                guildid TEXT NOT NULL PRIMARY KEY,
                hour INTEGER NOT NULL,
                minute INTEGER NOT NULL,
                inadvance INTEGER NOT NULL,
                channelid TEXT NOT NULL,
                embedcolor INTEGER NOT NULL
            );
            CREATE TABLE exams
            (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                year INTEGER NOT NULL,
                month INTEGER NOT NULL,
                day INTEGER NOT NULL,
                subject TEXT NOT NULL,
                type TEXT NOT NULL,
                topic TEXT NOT NULL,
                notifiedabout INTEGER NOT NULL CHECK (notifiedabout IN (0, 1)),
                guildid TEXT NOT NULL REFERENCES servers(guildid) ON DELETE CASCADE,
                roles TEXT NOT NULL
            );
        `)
        console.log('Successfully created database!')
    }
})