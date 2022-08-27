const {Telegraf, Markup, Composer, Scenes, session} = require('telegraf')
require('dotenv').config()

const {register, getLevel} = require('./functions')

const bot = new Telegraf(process.env.telegramBotToken)


const startRegistration = new Composer()
startRegistration.on('message', async ctx => {
    await ctx.replyWithSticker('CAACAgIAAxkBAAICg2MJqogB2PSzGmrweALXNt7RYd7yAAIBAQACVp29CiK-nw64wuY0KQQ')
    await ctx.reply(`Hello 👋 ƒractally member ${ctx.from.first_name}`, )
    await ctx.reply('I am ƒractally_level bot 😊, I show your information about last ƒractally meeting and notification about your level.Because you here first time can you write you hive username please ❤️',
        Markup
            .keyboard([
                ['Show my level'],
            ])
            .oneTime()
            .resize())

    return ctx.wizard.next()
})


const endRegistration = new Composer()
endRegistration.on('message', async ctx => {
    register(ctx.message.text, ctx.from.id)

    await ctx.reply(await getLevel(ctx.from.id),
        Markup.
        inlineKeyboard([
            Markup.button.url('Click here for Google sheets' , "http://telegraf.js.org"),
        ]))
    return ctx.scene.leave()
})


bot.hears('Show my level', async ctx => {
    await ctx.reply(await getLevel(ctx.from.id),
        Markup.
        inlineKeyboard([
        Markup.button.url('Click here for Google sheets' , "https://docs.google.com/spreadsheets/d/1XDyeUDxGKOUDA9u4usTIkIiA4GO7GAudBosSnHaFA1U/edit#gid=0"),
    ]))
})

bot.launch()


const Registration = new Scenes.WizardScene('sceneWizardRegistration', startRegistration, endRegistration)
const stage = new Scenes.Stage([Registration])
bot.use(session())
bot.use(stage.middleware())


bot.start(async ctx => {
    console.log('it is working')
    ctx.scene.enter('sceneWizardRegistration')
})