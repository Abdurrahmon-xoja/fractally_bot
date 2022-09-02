const {Telegraf, Markup, Composer, Scenes, session} = require('telegraf')
require('dotenv').config()

const {register, getLevelFront} = require('./functions')

const bot = new Telegraf(process.env.telegramBotToken)

//start scene
const startRegistration = new Composer()
startRegistration.on('message', async ctx => {
    await ctx.replyWithSticker('CAACAgIAAxkBAAICg2MJqogB2PSzGmrweALXNt7RYd7yAAIBAQACVp29CiK-nw64wuY0KQQ')
    await ctx.reply(`Hello 👋 ƒractally member ${ctx.from.first_name}`, )
    await ctx.reply('I am ƒractally_level bot 😊, I show your information about hive account and notify  you.Because you here first time can you write you hive username please ❤️')
})


const endRegistration = new Composer()
endRegistration.on('message', async ctx => {
    register(ctx.message.text, ctx.from.id)

    await ctx.reply(await getLevelFront(ctx.from.id),
        Markup
            .keyboard([
                ['Show my level'],
            ])
            .oneTime()
            .resize())
    return ctx.scene.leave()
})
// end sene

bot.hears('Show my level', async ctx => {
    await ctx.reply(await getLevelFront(ctx.from.id),
        Markup
            .keyboard([
                ['Show my level'],
            ])
            .oneTime()
            .resize()
        )
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