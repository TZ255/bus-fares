const router = require('express').Router()
const mkoa_db = require('../model/mikoa')

const oh_vids = require('../model/ohmy-vids')
const oh_users = require('../model/ohmy-users')
const oh_redirects = require('../model/oh-counter')

const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

//delaying
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

//send success (no content) response to browser
router.get('/favicon.ico', (req, res) => res.status(204).end());

router.get('/', async (req, res) => {
    try {
        let mikoadb = await mkoa_db.find().sort('mkoa')
        let mikoa = []
        mikoadb.forEach(mk => {
            mikoa.push(
                { name: mk.mkoa, idadi: mk.info.length }
            )
        })
        res.render('home/home', { mikoa })
    } catch (err) {
        console.log(err)
        console.log(err.message)
    }

})

router.get('/latra', (req, res) => {
    res.redirect('https://www.latra.go.tz/')
})

router.get('/privacy', (req, res) => {
    res.render('zzzpages/privacy')
})

router.get('/terms', (req, res) => {
    res.render('zzzpages/terms')
})

router.get('/disclaimer', (req, res) => {
    res.render('zzzpages/disclaimer')
})

router.get('/contact', (req, res) => {
    res.render('zzzpages/contact')
})

router.get('/about', (req, res) => {
    res.render('zzzpages/about')
})

router.get('/:mkoa', async (req, res) => {
    let mkoa_name = req.params.mkoa.replace(/_/g, ' ').toUpperCase()

    try {
        let mkoa = await mkoa_db.findOne({ mkoa: mkoa_name })
        //you can also slect ('name email age')
        let m_yote = await mkoa_db.find().sort('mkoa').select('mkoa')
        let yote = []
        m_yote.forEach(m => yote.push(m.mkoa))
        res.render('mkoa/mkoa', { mkoa, yote })
    } catch (err) {
        console.log(err)
        console.log(err.message)
    }
})

router.get('/:mkoa/:rid', async (req, res) => {
    if (req.params.mkoa == 'DAR ES SALAAM' || req.params.mkoa == 'dar es salaam') {
        res.redirect(301, `/DAR_ES_SALAAM/${req.params.rid}`)
    }

    else {
        let mkoa = req.params.mkoa.toUpperCase().replace(/_/g, ' ').trim()
        let rid = req.params.rid.trim()

        try {
            let post = await mkoa_db.findOne({ mkoa }).select({ info: { $elemMatch: { rid } } })
            let others = await mkoa_db.findOne({ mkoa }).select('info')
            res.render('articles/article', { mkoa, post, others })
        } catch (err) {
            console.log(err)
            console.log(err.message)
        }
    }

})

router.get('/ohmy/:chatid/:nano', async (req, res) => {
    let chatid = req.params.chatid
    let nano = req.params.nano

    try {
        let lead_url = `https://redirecting5.eu/p/tveg/GFOt/46RX`
        let ohmyDB = -1001586042518
        let shemdoe = 741815228

        res.redirect(lead_url)
        await oh_redirects.findOneAndUpdate({id: 'shemdoe'}, {$inc: {count: 1}})
        let vid = await oh_vids.findOne({ nano })
        setTimeout(() => {
            bot.telegram.copyMessage(Number(chatid), ohmyDB, vid.msgId, {
                reply_markup: {
                    parse_mode: 'HTML',
                    inline_keyboard: [[
                        { text: 'Join Here For More...', url: 'https://t.me/+TCbCXgoThW0xOThk' }
                    ]]
                }
            })
                .then(() => console.log('Video sent by req'))
                .catch(async (err) => {
                    await bot.telegram.sendMessage(shemdoe, 'Web Req: ' + err.message)
                        .catch(e => console.log(e.message))
                })
        }, 10000)

    } catch (error) {
        console.log(`${error.message} on nano: "${nano}" for user "${chatid}"`)
    }
})

module.exports = router