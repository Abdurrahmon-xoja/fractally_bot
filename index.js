const {Telegraf, Markup, Composer, Scenes, session} = require('telegraf')
require('dotenv').config()

const {register, getLevelFront, isExistInDb , showOthers , top12} = require('./functions')

const bot = new Telegraf(process.env.telegramBotToken)

//start scene
const startRegistration = new Composer()
startRegistration.on('message', async ctx => {
    await ctx.replyWithSticker('CAACAgIAAxkBAAICg2MJqogB2PSzGmrweALXNt7RYd7yAAIBAQACVp29CiK-nw64wuY0KQQ')
    await ctx.reply(`Hello 👋 ${ctx.from.first_name}`)
    await ctx.replyWithHTML(`Do you have hive account`, Markup
        .keyboard([
            ['Yes', 'No']
        ])
        .oneTime()
        .resize()
    )

    // await ctx.reply('I am ƒractally_level bot 😊, I show your information about hive account and notify  you.Because you here first time can you write you hive username please ❤️')
    // render buttons yes no
    ctx.wizard.next()
})


const sortingRegistration = new Composer()
sortingRegistration.on('message', async ctx => {
    if (ctx.message.text == 'No') {
        await ctx.replyWithHTML('You can register <a href="https://hive.blog">here</a>')
        return ctx.scene.leave()
    } else if (ctx.message.text == 'Yes') {
        await ctx.reply('Please write you hive account')
        ctx.wizard.next()
    }
})

const endRegistration = new Composer()
endRegistration.on('message', async ctx => {
    let checked = false
    if (await isExistInDb(ctx.message.text)) {
        register(ctx.message.text, ctx.from.id)
        await ctx.reply('You have been registered' ,
            Markup
                .keyboard([
                    ['Show my level'],
                    ['Show others hive'],
                    ['Top12']
                ])
                .oneTime()
                .resize()
        )
        checked = true
    } else {
        await ctx.reply(`we do not have account ${ctx.message.text} try again` ,)
    }

    if(checked){
        return ctx.scene.leave()
    }
})
// end scene


const startStats = new Composer()
startStats.on('message' , async ctx => {
    await ctx.reply('Write account stats you want see')
    ctx.wizard.next()
})

const endStats = new Composer()
endStats.on('message' , async ctx=>{
    if(isExistInDb(ctx.message.tex)){
        await ctx.reply(await showOthers(ctx.message.text) ,
            Markup
                .keyboard([
                    ['Show my level'],
                    ['Show others hive'],
                    ['Top12']
                ])
                .oneTime()
                .resize()
        )
    }else {
        await ctx.reply(`${ctx.message.text} not exist `,
            Markup
                .keyboard([
                    ['Show my level'],
                    ['Show others hive'],
                    ['Top12']
                ])
                .oneTime()
                .resize()
        )
    }
    return ctx.scene.leave()
})


bot.hears('Show my level', async ctx => {
    await ctx.reply(await getLevelFront(ctx.from.id),
        Markup
            .keyboard([
                ['Show my level'],
                ['Show others hive'],
                ['Top12']
            ])
            .oneTime()
            .resize()
    )
})

bot.hears('Top12', async ctx => {
    ctx.reply(await top12(), Markup
        .keyboard([
            ['Show my level'],
            ['Show others hive'],
            ['Top12']
        ])
        .oneTime()
        .resize()
    )
})





bot.launch()


const Registration = new Scenes.WizardScene('sceneWizardRegistration', startRegistration, sortingRegistration, endRegistration)
const showStats = new Scenes.WizardScene('sceneWizardStats', startStats, endStats)
const stage = new Scenes.Stage([Registration,showStats])
bot.use(session())
bot.use(stage.middleware())


bot.start(async ctx => {
    ctx.scene.enter('sceneWizardRegistration')
})


bot.hears('Show others hive' , async ctx =>{
    ctx.scene.enter('sceneWizardStats')
})