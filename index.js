const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { default: puppeteer } = require("puppeteer")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function respond(res, msg = '', data = {}, status = 400) {
    return res.status(status).json({ status, msg, data })
}

app.post('/scrapQr', async (req, res) => {
    const { redirect_url } = req.body
    if(!redirect_url || redirect_url.trim().length === 0) return respond(res, 'Invalid request!')

    try {
        const launchOptions = {
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process', // <- this one doesn't works in Windows
                '--disable-gpu'
            ],
            headless: true
        }
        
        const browser = await puppeteer.launch(launchOptions)
        const page = await browser.newPage()
        await page.goto(redirect_url)
        
        // Set screen size so that fonepay loads qr, as fonepay doesnot show qr on lower devices
        await page.setViewport({ width: 1920, height: 1080 });
        
        const qrClass = '.qr-img'
        await page.waitForSelector(qrClass, { timeout: 15000 })
        const element = await page.$(qrClass)
        const base64ImageData = await element.screenshot( { encoding: 'base64' } )
        const image = 'data:image/png;base64,' + base64ImageData
        await browser.close()

        return respond(res, 'Qr base64 image data', { qr: image }, 200)

    } catch (error) {
        console.log(error)
        return respond(res, 'Either duplicate prn or an unknown error occurred in server!', {}, 500)
    }
})

const port = 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})