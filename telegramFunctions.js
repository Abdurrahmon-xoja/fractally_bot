const {Telegraf} = require('telegraf')
const {getTelegramID} = require("./functions");
require('dotenv').config()

const bot = new Telegraf(process.env.telegramBotToken)


function sendMessage(telegramID,message){
    bot.telegram.sendMessage(telegramID, message)
}

module.exports = {
    sendMessage
}