const Telegraf = require("telegraf");
const bot = new Telegraf("5095484960:AAH-tVfHei20nF0On0UjCC5cm8cikWtTR5w");
const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bot",
});
conn.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log("connected !");
  conn.query("SELECT * FROM fruit", function (err, result, fields) {
    if (err) {
      throw err;
    }
    dataStore = [];

    result.forEach((item) => {
      dataStore.push({
        id: item.id,
        name: item.name,
        price: item.price,
      });
    });
  });
});

const helpMessage = `
    Для использования этого бота есть несколько команд:
    /fruitlist - для просмотра списка фруктов.
    /fruit <nama_buah> - чтобы увидеть цену на фрукты, основанную на названии фрукта.
    `;
bot.help((ctx) => {
  ctx.reply(helpMessage);
});

bot.command("fruitlist", (ctx) => {
  let fruitMessage = `Список фруктов : \n`;

  dataStore.forEach((item) => {
    fruitMessage += `${item.id}. ${item.name}\n`;
  });
  ctx.reply(fruitMessage);
});

bot.command("addfruit", (ctx) => {
  let input = ctx.message.text.split(" ");
  if (input.length != 2) {
    ctx.reply("Вы должны дать название фрукта в аргументе 2");
    return;
  }
  console.log(input[1]);
  console.log(input[2]);
  // let fruitInput = input[1];

});

bot.launch();
