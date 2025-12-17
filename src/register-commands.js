require('dotenv').config();

const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'exam',
        description: 'Reminds you of the exam the specified date and time.',
        options: [
            {
                name: 'date',
                description: '(MM.DD.)',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'subject',
                description: 'The subject of the class.',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'type',
                description: 'The type of exam.',
                choices: [
                    {
                        name: 'Röpdolgozat',
                        value: 'röpi'
                    },
                    {
                        name: 'Témazáró',
                        value: 'TZ'
                    },
                ],
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'topic',
                description: 'The topic of the exam.',
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
    },
    {
        name: 'config',
        description: 'Sets when to send reminders.',
        options: [
            {
                name: 'time',
                description: 'At what time should the reminders be sent (HH:MM)?',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'days_in_advance',
                description: 'How many days in advance should the reminder be sent?',
                type: ApplicationCommandOptionType.Integer,
                required: true
            },
            {
                name: 'embedcolor',
                description: 'Sets the color of the embeds in the reminders and the list produced by /list.',
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
    },
    {
        name: 'list',
        description: 'Lists all exams.'
    },
    {
        name: 'remove',
        description: 'Removes an exam at the specified id.',
        options: [
            {
                name: 'id',
                description: 'The id of the exam to remove.',
                type: ApplicationCommandOptionType.Integer,
                required: true
            },
        ]
    },
    {
        name: 'help',
        description: 'Provides information on how to use the bot.'
    },
    {
        name: 'getconfig',
        description: 'Displays all info in the config.'
    },
    {
        name: 'removeall',
        description: 'Removes all exams.'
    },
    {
        name: 'reset',
        description: 'Resets and deletes the configs.'
    }
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try{
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID,
            ),
            { body: commands }
        )
        console.log('Registering slash commands done successfuly!')
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();