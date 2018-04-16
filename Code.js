const Telegraf = require('telegraf');
const app = new Telegraf(process.env.BOT_KEY, {username: process.env.BOT_NAME});
const Wikia = require('node-wikia');
const YGO = new Wikia('yugioh');

require('dotenv').config();

app.command('start', (ctx) => {
    ctx.reply('Welcome to Yu-Gi-Oh! Bot.\nLost? Use /help');
});

app.command('help', (ctx) => {
    ctx.reply('To search: /card [name].\nTo send a feedback: /feedback [suggestion].\nUse the complete name of the card (in lower case and without typo):\n/card exodia the forbidden one');
});

app.command('card', (ctx) => {
    var key = ctx.message.text.replace(/[^\s]+ /, '').trim();
    
    var options = {query: key};

    YGO.getSearchList(options).then(function(data){
        var name = data.items[0].id;
        var opt = {ids: name};
        YGO.getArticleDetails(opt).then(function(data){
            var Nodes = data.items;
            for(var elem in Nodes){
                if(Nodes.hasOwnProperty(elem)){
                    var art = Nodes[elem].thumbnail.replace(/.png.*/, '.png').replace(/.jpg.*/, '.jpg');

                    var Art = `[⁣](${art})`;
                    ctx.replyWithMarkdown(Art);
                } 
            }
        })
            .fail(function(err){
                console.log('RIP Info: ' + err);
                ctx.reply('Card not found 😦');
            });
    })
        .fail(function(err){
            console.log('RIP Search: ' + err);
            ctx.reply('Card not found 😦');
        });
});

app.startPolling();