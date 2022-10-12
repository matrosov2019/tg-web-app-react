const TelegramBot = require('node-telegram-bot-api');

const token = '5726828664:AAF06baBgCvYtlc5NvYd6fedKaYObIIW2kg';

const webAppUrl = "https://enchanting-meerkat-479db5.netlify.app";

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, async (msg, match) => {

    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);

});

bot.on('message', async (msg) => {

    const chatId = msg.chat.id;
    const text = msg.text;
    //const resp = match[1]; // the captured "whatever"
    if (text === "/start") {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Заполните форму',
                            web_app: {
                                url: webAppUrl + '/form'
                            }
                        }
                    ]
                ]
            }
        });
        /*
        await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Сделать заказ',
                            web_app: {
                                url: webAppUrl
                            }
                        }
                    ]
                ]
            }
        });
         */
    }

    if (msg?.web_app_data?.data) {
        //Обработка данных формы
        try {
            const data = JSON.parse(msg?.web_app_data?.data);
            await bot.sendMessage(chatId,'Спасибо за обратную связь');
            await bot.sendMessage(chatId, 'Ваша страна: ' + data.country);
            await bot.sendMessage(chatId, 'Ваша улица: ' + data.street);

            setTimeout(async() => {
                await bot.sendMessage(chatId,'Всю информацию вы получите в этом чате');
            }, 3000);
        } catch(e) {

        }
    }

});
