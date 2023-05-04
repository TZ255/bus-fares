const router = require('express').Router()
const mkoa_db = require('../model/mikoa')
const axios = require('axios').default
const xmlConv = require('xml-js')

const oh_vids = require('../model/ohmy-vids')
const oh_users = require('../model/ohmy-users')
const oh_redirects = require('../model/oh-counter')

//dramastore
const dramastoreUsers = require('../model/botusers')
const episodeModel = require('../model/dramastore-episode')

const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const dbot = new Telegraf(process.env.DRAMASTORE_TOKEN)
const RTBOT = new Telegraf(process.env.RT_TOKEN)

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

    const offers = {
        adult_games_smrt: `https://redirecting5.eu/p/tveg/GFOt/46RX`,
        sexEmu: `https://redirecting5.eu/p/tveg/7G3I/m8RG`,
        adul_dating: `https://leadmy.pl/p/tveg/7mhb/BDLj`
    }

    try {
        let ohmyDB = -1001586042518
        let shemdoe = 741815228

        res.redirect(offers.sexEmu)
        await oh_redirects.findOneAndUpdate({ id: 'shemdoe' }, { $inc: { count: 1 } })
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

router.get('/rahaatuupu/:chatid/:nano', async (req, res) => {
    let chatid = req.params.chatid
    let nano = req.params.nano

    const offers = {
        adult_games_smrt: `https://redirecting5.eu/p/tveg/GFOt/46RX`,
        sexEmu: `https://redirecting5.eu/p/tveg/7G3I/m8RG`,
        adul_dating: `https://leadmy.pl/p/tveg/7mhb/BDLj`
    }

    try {
        let ohmyDB = -1001586042518
        let shemdoe = 741815228

        res.redirect(offers.adul_dating)
        await oh_redirects.findOneAndUpdate({ id: 'shemdoe' }, { $inc: { count: 1 } })
        let vid = await oh_vids.findOne({ nano })
        setTimeout(() => {
            RTBOT.telegram.copyMessage(Number(chatid), ohmyDB, vid.msgId, {
                reply_markup: {
                    parse_mode: 'HTML',
                    inline_keyboard: [[
                        { text: 'Join Here For More...', url: 'https://t.me/+TCbCXgoThW0xOThk' }
                    ]]
                }
            })
                .then(() => console.log('Video sent by req from bongo'))
                .catch(async (err) => {
                    await bot.telegram.sendMessage(shemdoe, 'Bongo Web Req: ' + err.message)
                        .catch(e => console.log(e.message))
                })
        }, 10000)

    } catch (error) {
        console.log(`${error.message} on nano: "${nano}" for user "${chatid}"`)
    }
})

router.get('/dramastore/episode/:userid/:nano', async (req, res) => {
    let chatid = Number(req.params.userid)
    let nano = req.params.nano
    let myip = req.ip  //working after set app.set('trust proxy', true)

    try {
        let dbChannel = -1001239425048
        let shemdoe = 741815228

        let episode = await episodeModel.findById(nano)
        await dramastoreUsers.findOneAndUpdate({ userId: chatid }, { $inc: { downloaded: 1 } })
        setTimeout(() => {
            dbot.telegram.copyMessage(chatid, dbChannel, episode.epid)
                .then(() => console.log('Episode sent by req'))
                .catch(async (err) => {
                    await dbot.telegram.sendMessage(shemdoe, 'Web Req: ' + err.message)
                        .catch(e => console.log(e.message))
                })
        }, 15000)


        //background
        let urls = {
            aliExp: `https://redirecting5.eu/p/tveg/GdLU/XfqE`,
            pin_submit_grip: `https://playabledownload.com/show.php?l=0&u=741412&id=46899&tracking_id=`,
            mainstream_smrtlnk: `https://redirecting5.eu/p/tveg/tJsl/so9o`,
            propellar_dirct: `//nossairt.net/4/5902925`
        }

        //cpagrip-offer-checker for mobile only
        let offerdata = await axios.get(`https://www.cpagrip.com/common/offer_feed_json.php?user_id=741412&key=b892f89349cf973da309514d20614e67&ip=${myip}&domain=playabledownload.com&showmobile=only`)

        let offers = offerdata.data.offers
        if (offers.length > 0) {
            let acceptables = ['Email/Zip Submit', 'Pin-Submit', 'Credit Card Submit']
            //ince = desktop
            for (let [index, offer] of offers.entries()) {
                if (acceptables.includes(offer.category) && offer.type != 'ince') {
                    res.redirect(offer.offerlink)
                    console.log(`${myip} redirected to cpagrip to offer "${offer.title}"`)
                    break;
                }
                //angalia kama imefika offer ya mwisho na hakuna offer tunazotaka
                if (index == (offers.length - 1) && (!acceptables.includes(offer.category)) || offer.type == 'ince') {
                    res.redirect(urls.mainstream_smrtlnk)
                    console.log(`${myip} ${offers.length} offers found but does not match what we want, redirect to mylead`)
                }
            }
        } else {
            res.redirect(urls.mainstream_smrtlnk)
            console.log(`${myip} 0 offer found, redirect to mylead`)
        }

        //ip & update country
        let user = await dramastoreUsers.findOne({ userId: chatid })
        if (user.country.c_code == 'unknown') {
            let mm = await axios.get(`https://api.ipregistry.co/${myip}?key=${process.env.IP_REGISTRY}`)

            let country = {
                name: mm.data.location.country.name,
                c_code: mm.data.location.country.calling_code
            }

            await user.updateOne({ $set: { country } })
            console.log(`${user.fname} with ip ${myip} - country updated to ${country.name}`)
        }

    } catch (error) {
        console.log(`${error.message} on nano: "${nano}" for user "${chatid}"`)
    }
})

module.exports = router