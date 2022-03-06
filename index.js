import { CommentStream } from 'snoostorm';
import { readFile } from 'fs/promises';
import Snoowrap from 'snoowrap';

const BOT_START = Date.now() / 1000;
const copyPasta = await readFile('./copy-pasta.txt', 'utf8');
const client = new Snoowrap({
    "userAgent": "Fruktnøtt reddit bot",
    "clientId": process.env.CLIENT_ID,
    "clientSecret": process.env.CLIENT_SECRET,
    "username": process.env.USERNAME,
    "password": process.env.PASSWORD,
});
const stream = (subReddit) => {
    return new CommentStream(client, {
        subreddit: subReddit,
        pollTime: 10000,
        limit: 10,
    });
};

const isFresh = (comment) => {
    return BOT_START <= comment.created_utc;
}
const isSummoned = (property) => {
    return property.toLowerCase().includes('/u/fruktnott-bot');
};
const isFoundIn = (property) => {
    return property.toLowerCase().includes('fruktnøtt');
}
const isIgnored = (commentor) => {
    return ['fruktnott-bot'].includes(commentor.toLowerCase());
}
const shouldRespond = (comment) => {
    const { body, link_title, author } = comment;
    const isMetaMatch = !isIgnored(author.name) && isFresh(comment);
    const isTextMatch = isSummoned(body) || isFoundIn(body) || isFoundIn(link_title);
    const matchesCriteria = isMetaMatch && isTextMatch;
    return matchesCriteria;
}
const reactTo = (comment) => {
    if (shouldRespond(comment)) {
        console.log("------ -FRUKTNØTT! -----");
        console.log(comment);
        comment.reply(copyPasta);
    }
}

try {
    stream('Norway').on('item', comment => reactTo(comment));
} catch (error) { console.error("Norway error", error); }

try {
    stream('norge').on('item', comment => reactTo(comment));
} catch (error) { console.error("Norge error", error); }

try {
    stream('Oslo').on('item', comment => reactTo(comment));
} catch (error) { console.error("Oslo error", error); }

console.log("Streaming");
