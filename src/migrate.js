const Database = require('better-sqlite3')
const fs = require('fs')

if (fs.existsSync('database.db')) {
    console.log('Database already exists! Skipping database creation...')
}
else {
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
            embedcolor INTEGER NOT NULL,
            config TEXT,
            exam TEXT,
            getconfig TEXT,
            help TEXT,
            list TEXT,
            listroles TEXT,
            manageroles TEXT,
            remove TEXT,
            removeall TEXT,
            reset TEXT
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
            pings TEXT NOT NULL
        );
    `)

    db.close()
    console.log('Successfully created database!')
}