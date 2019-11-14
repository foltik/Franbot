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
    [/\bowo\b|\bo\s*w\s*o\b|(?<!c)owo(?!r|f|u)|uw+u|\bu\s*w\s*u\b|\ba\s*w\s*o\s*o\b|0\s*w\s*0|(🇴|🅾|⭕)\s*🇼\s*(🇴|🅾|⭕)|🇺\s*🇼\s*🇺|👁\s*w\s*👁|(🅰 |🇦)\s*🇼\s*(🇴|🅾|⭕)\s*(🇴|🅾|⭕)/g, lower, [
        'https://i.kym-cdn.com/photos/images/facebook/000/910/542/1e8.jpg',
        'https://i.kym-cdn.com/photos/images/original/001/408/772/b08.jpg',
        'https://cdn.dopl3r.com/memes_files/rules-of-the-cool-club-1-no-anime-UPuUO.jpg'
    ]]
];

enabled = true;

const filter = msg =>
      enabled && banned.map(([regex, pre, imgs]) =>
          pre(msg.content).match(regex) && msg.reply(choice(imgs)));

const cmds = [
    [/i hate furries/g, msg => {
        enabled = true;
        msg.reply('As it should be in my blessed lands.');
    }],
    [/i love furries/g, msg => {
        enabled = false;
        msg.reply('As you wish, degenerate.');
    }],
    [/fran ?bot/g, msg => {
        msg.react("❤");
    }],
    [/ihadurca/g, msg => {
        msg.react("😍");
    }]
];

const scan = msg =>
      cmds.map(([regex, fn]) =>
          msg.content.toLowerCase().match(regex) && fn(msg));

client.on('message', msg => {
    scan(msg);
    filter(msg);
});

client.on('ready', () => console.log(`${client.user.tag} has entered the arena!`));

client.login('token');
