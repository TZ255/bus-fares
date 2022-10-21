const router = require('express').Router()
const mkoa_db = require('../model/mikoa')

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

module.exports = router