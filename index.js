const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '5726828664:AAF06baBgCvYtlc5NvYd6fedKaYObIIW2kg';

const webAppUrl = "https://enchanting-meerkat-479db5.netlify.app";

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors);

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
                keyboard: [
                    [
                        {
                            text: 'Заполнить форму',
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

    console.log('msg: ', msg);
    if (msg?.web_app_data?.data) {
        //Обработка данных формы
        try {
            const data = JSON.parse(msg?.web_app_data?.data);
            await bot.sendMessage(chatId, 'Спасибо за обратную связь');
            await bot.sendMessage(chatId, 'Ваша страна: ' + data.country);
            await bot.sendMessage(chatId, 'Ваша улица: ' + data.street);

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            }, 3000);
        } catch (e) {

        }
    }

});

app.post('/web-data', async (req, res) => {
    const {
        products,
        totalPrice,
        queryId
    } = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: `Поздравляем с покупкой! Вы приобрели ${products.length} товаров на сумму ${totalPrice} руб`
            }
        });
        return res.status(200).json({});
    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось приобрести товар',
            input_message_content: {
                message_text: 'Не удалось приобрести товар'
            }
        });
        return res.status(500).json({});
    }



});
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
