const { Telegraf } = require('telegraf')
require('dotenv').config()

const { getHive , isExist} = require('./functions')

const bot = new Telegraf(process.env.telegramBotToken)


bot.start(ctx => {
    ctx.reply('write hive account')
})


bot.on('message', ctx => {
    if(isExist(ctx.message.text)){
        ctx.reply(getHive(ctx.message.text))
        ctx.reply('write hive account')
    }else {
        ctx.reply('this hive account not exist try another one')
    }


})



bot.launch()