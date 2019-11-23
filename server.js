require('dotenv').config();



const mongoose = require('mongoose');
const schema = mongoose.Schema({
    _id: {type: String, index: true, unique: true},

    messages: {type: Number, default: 0},
    mentions: {type: Number, default: 0},
    reacts: {type: Number, default: 0},
    emotes: {type: Number, default: 0},
    words: {type: Number, default: 0},

    mention_usage: {type: Object, default: {}},
    react_usage: {type: Object, default: {}},
    emote_usage: {type: Object, default: {}},
    word_usage: {type: Object, default: {}},
    channel_usage: {type: Object, default: {}}

}, {minimize: false});
const User = mongoose.model('User', schema);
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});

let mutex = Promise.resolve();
const locked = fn => async (...args) => {
    const unlock = await new Promise(cb => mutex = mutex.then(() => new Promise(cb)));
    const res = await Promise.resolve(fn(...args));
    unlock();
    return res;
};

const cache = {};
const save_user = async user => cache[user._id] = await user.save();
const cache_user = async _id => !cache[_id]
      && (cache[_id] = await User.findById(_id) || await save_user(new User({_id})));
const find_user = async _id => (await cache_user(_id), cache[_id]);




const choice = arr => arr[Math.floor(Math.random() * arr.length)];
const demarkdown = str => str.replace(/\*|_|~/g, '');
const lower = str => demarkdown(str.toLowerCase());
const trim = str => demarkdown(str.toLowerCase().replace(/\s/g, ''));

const banned = [
    [/furr(y|ies)/g, trim, [
        'https://media1.tenor.com/images/d22d04148e843750074fab5a6cc9bc31/tenor.gif',
        'https://assets.change.org/photos/5/qt/cu/CNqTCubXjaiVAXU-800x450-noPad.jpg',
    ]],
    [/fur(suit|sona)/g, trim, [
        'https://i.kym-cdn.com/photos/images/newsfeed/000/995/030/65e.jpg'
    ]],
    [/(b|n)uz+l[A-z]+/g, trim, [
        'https://cdn131.picsart.com/291896429008211.png?r1024x1024'
    ]],
    [/\bowo\b|\bo\s*w\s*o\b|(?<!c)owo(?!r|f|u)|uw+u|\bu\s*w\s*u\b|\ba\s*w\s*o\s*o\b|0\s*w\s*0|(🇴|🅾|⭕)\s*🇼\s*(🇴|🅾|⭕)|🇺\s*🇼\s*🇺|👁\s*w\s*👁|(🅰 |🇦)\s*🇼\s*(🇴|🅾|⭕)\s*(🇴|🅾|⭕)+/g, lower, [
        'https://i.kym-cdn.com/photos/images/facebook/000/910/542/1e8.jpg',
        'https://i.kym-cdn.com/photos/images/original/001/408/772/b08.jpg',
        'https://cdn.dopl3r.com/memes_files/rules-of-the-cool-club-1-no-anime-UPuUO.jpg'
    ]]
];

enabled = true;
const filter = msg =>
      enabled && banned.map(([regex, pre, imgs]) =>
          pre(msg.content).match(regex) && msg.reply(choice(imgs)));



const analyze_msg = locked(async msg => {
    const u = await find_user(msg.member.id);

    u.messages++;
    // ...

    await save_user(u);
});

const analyze_react = locked(async (react, user) => {
    const u = await find_user(user.id);

    u.reacts++;
    // ...

    await save_user(u);
});



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



const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', msg => {
    console.log(`#${msg.channel.name} <${msg.member.displayName}>: ${msg.content}`);

    scan(msg);
    filter(msg);
});

client.on('messageUpdate', (old, msg) => {
    console.log(`#${msg.channel.name} <${msg.member.displayName}> EDIT: ${old.content} -> ${msg.content}`);

    filter(msg);
});

client.on('messageReactionAdd', analyze_react);
client.on('message', analyze_msg);

client.on('ready', () => console.log(`${client.user.tag} has entered the arena!`));

client.login(process.env.TOKEN);
