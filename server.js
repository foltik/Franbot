const Discord = require('discord.js');
const client = new Discord.Client();

const choice = arr => arr[Math.floor(Math.random() * arr.length)];

const lower = str => str.toLowerCase();
const trim = str => str.toLowerCase().replace(/\s/g, '');

const banned = [
    [/furr(y|ies)/g, trim, [
        'https://media1.tenor.com/images/d22d04148e843750074fab5a6cc9bc31/tenor.gif',
        'https://assets.change.org/photos/5/qt/cu/CNqTCubXjaiVAXU-800x450-noPad.jpg',
    ]],
    [/fur(suit|sona)/g, trim, [
        'https://i.kym-cdn.com/photos/images/newsfeed/000/995/030/65e.jpg'
    ]],
    [/owo(?!r|f)|uwu|awoo|0w0/g, lower, [
        'https://i.kym-cdn.com/photos/images/facebook/000/910/542/1e8.jpg',
        'https://i.kym-cdn.com/photos/images/original/001/408/772/b08.jpg',
        'https://cdn.dopl3r.com/memes_files/rules-of-the-cool-club-1-no-anime-UPuUO.jpg'
    ]]
];

enabled = true;

const filter = msg =>
      enabled && banned.map(([regex, pre, imgs]) =>
          pre(msg.content).match(regex) && msg.channel.send(`<@${msg.author.id}>`, {file: choice(imgs)}));

const cmds = [
    [/i hate furries/g, msg => {
        enabled = true;
        msg.reply('As it should be in my blessed lands.');
    }],
    [/i love furries/g, msg => {
        enabled = false;
        msg.reply('As you wish, degenerate.');
    }]
];

const scan = msg =>
      cmds.some(([regex, fn]) =>
          msg.content.toLowerCase().match(regex) && (fn(msg), true));

client.on('message', msg => {
    if (scan(msg))
        return;

    filter(msg);
});

client.on('ready', () => console.log(`${client.user.tag} has entered the arena!`));

client.login('token');
