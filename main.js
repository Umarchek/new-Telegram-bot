const TelegramBot = require('node-telegram-bot-api'); // подключаем node-telegram-bot-api
const token = '2102216686:AAF4Y3hwMGcBoAARfvhNscI7Fh_Gg0O3vLE';
const bot = new TelegramBot(token, {polling: true});// создаем бота

const getData = require('./getData.js'); // обслуживаем API fetch
// сам бот::
const keyboard = require('./keyboard.js'); // описываем меню бота

// Обрабтка отправки картинки
const sendImg = (chatId,img) =>{
    if (img) {
        bot.sendPhoto(chatId, img);
    } 
}
// Обработка валюты 
const sendMoneyExchengeRates = (chatId,money) =>{
 
    getData('https://api.exchangeratesapi.io/latest?base=USD').then( data  => {
            const rate = data.rates;                       
            bot.sendMessage(chatId, ` USD = ${rate[money].toFixed(2)}`);      
            
        });
        getData('https://api.exchangeratesapi.io/latest?base=EUR').then( data  => {  
            const rate = data.rates;            
            bot.sendMessage(chatId, ` EUR = ${rate[money].toFixed(2)}`);           
        });       
}

// ** //
// обработчик события присылания нам любого сообщения
bot.on('message', (msg) => {
  const chatId = msg.chat.id; //получаем идентификатор диалога, чтобы отвечать именно тому пользователю, который нам что-то прислал
    if(msg.text.toLowerCase() == '/menu'){
        
        // отправляем сообщение
        bot.sendMessage(chatId, 'Меню:', { // прикрутим клаву
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    }else if(msg.text.toLowerCase() == '/img'){
        sendImg(chatId,'boy.jpg');
    }else{
        bot.sendMessage(chatId,'Я не понял')
    }
});

// ** //
// обработчик событий нажатий на клавиатуру
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;

    if (query.data === 'RUB') { // курсы вылют
            sendMoneyExchengeRates(chatId,'RUB');
    }
    
    if (query.data === 'joke') { // погода            
        getData('https://icanhazdadjoke.com/',{ method: 'GET', headers: {'Accept': 'application/json' }})
        .then( data  => {   
            console.log(data.joke)        
        bot.sendMessage(chatId, ` ${data.joke}`);       
        });       
    }

    if (query.data === 'wether') { // погода        
        getData('https://api.openweathermap.org/data/2.5/weather?id=562450&appid=658790e853befcc579c25cc91de06623&units=metric')
        .then( data  => {           
        bot.sendMessage(chatId, ` ${data.name} : мин: ${data.main.temp_min}, макс: ${data.main.temp_max}`);       
        });
    }    

    if (query.data === 'music') { // если музыка
        bot.sendAudio(chatId,'./audio/1.mp3');        
    }

    if(query.data === 'img'){
        getData('https://api.unsplash.com/photos/?client_id=0i3sh3ZkjbCnmFQFwPSFS_GF8m6tJokeEFfdmeWxgkw').then(
            data  => { 
                const pic = data[0].urls          
               // console.log(pic.regular);
                sendImg(chatId,pic.regular);       
            }
        )
        sendImg(chatId,'boy.jpg');       
    };
});