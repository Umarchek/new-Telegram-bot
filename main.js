
/* Get you Telegram Bot Token @BotFater */

const TOKEN = '2102216686:AAF4Y3hwMGcBoAARfvhNscI7Fh_Gg0O3vLE';
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(TOKEN, { polling: { timeout: 1, interval: 100 } });

/* Create your own API Token on https://steamapi.io */
var STEAM_API_TOKEN = '';

/* Create your own Steam API Token on https://steamcommunity.com/dev/apikey */
var STEAM_OF_API_TOKEN = '';

/* Steam Price Api URL */
var STEAM_PRICE_API = 'https://api.steamapi.io/api/account?key={1}';

/* Steam API URL's */
var STEAM_SERVER_STATUS_API = 'https://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v1/?key={0}';
var STEAM_USER_ID = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key={0}&vanityurl={1}';

//Load the request module
var request = require('request')

var opts = {
    reply_markup: JSON.stringify(
        {
            force_reply: true
        }
    )
};

// Replacement like in Python
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

/* WELCOME MESSAGE */
bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    console.log(msg);
    if (msg.text == "/start") {
        // bot.sendMessage(chatId, "Hello, just tell me the name of CSGO Skin. Exempel: AWP | Asiimov (Field-Tested) Price will be automaticly updated in 1min");
        bot.sendMessage(chatId, "Hello. Im CSGO Prices DevBot. I will help you to get some info about this game. Use /status to get servr status. Use /price to get Skin price. Or /help");
    }
    if (msg.text == "/help") {
        // bot.sendMessage(chatId, "Hello, just tell me the name of CSGO Skin. Exempel: AWP | Asiimov (Field-Tested) Price will be automaticly updated in 1min");
        bot.sendMessage(chatId, "/start /status /price /id");
    }
});

/* Get server status for CSGO */
bot.on('message', function (msg) {
    if (msg.text == "/status") {
        var url = '';
        url = STEAM_SERVER_STATUS_API.format(STEAM_OF_API_TOKEN);
        request({
            url: url,
            json: true
        }, function (error, response, data) {
            if (!error && response.statusCode == 200) {
                bot.sendMessage(msg.chat.id, "Server status: " + data['result']['matchmaking']['scheduler'] + ". Online Servers: " + data['result']['matchmaking']['online_servers'] + ". Online Players: " + data['result']['matchmaking']['online_players'] + ". Players Searching: " + data['result']['matchmaking']['searching_players'] + ".");
            } else {
                bot.sendMessage(msg.chat.id, "Sorry, I cant fetch data right now, try latter! :(")
            }
        })
    }
});


var opts = {
    reply_markup: JSON.stringify(
        {
            force_reply: true
        }
    )
};

/* Get name - return lowest price*/
bot.on('message', function (msg) {
    if (msg.text == '/price') {
        bot.sendMessage(msg.chat.id, 'What Skin you are looking for?', opts)
            .then(function (sended) {
                bot.onReplyToMessage(msg.chat.id, sended.message_id, function (message) {
                    var url = '';
                    url = STEAM_PRICE_API.format(message.text, STEAM_API_TOKEN);
                    /*console.log(url);*/
                    request({
                        url: url,
                        json: true
                    }, function (error, response, data) {
                        if (!error && response.statusCode === 200) {
                            bot.sendMessage(msg.chat.id, data['data']['market_hash_name'] + " - " + data['data']['prices']['lowest'] + "$");
                        }
                    })
                });
            });
    }
});

/* Get stem User ID*/
bot.on('message', function (msg) {
    if (msg.text == '/id') {
        bot.sendMessage(msg.chat.id, 'What is your custom ID? (https://steamcommunity.com/id/YOUR_ID)', opts)
            .then(function (sended) {
                bot.onReplyToMessage(msg.chat.id, sended.message_id, function (message) {
                    var url = '';
                    url = STEAM_USER_ID.format(STEAM_OF_API_TOKEN, message.text);
                    // console.log(url);
                    request({
                        url: url,
                        json: true
                    }, function (error, response, data) {
                        if (!error && response.statusCode === 200) {
                            bot.sendMessage(msg.chat.id, "Your ID: " + data['response']['steamid']);
                        }
                    })
                });
            });
    }
});




/* Dont Die BITCH! */
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});