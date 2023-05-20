const { default: puppeteer } = require("puppeteer");

(async () => {

 try {
    const url = 'https://clientapi.fonepay.com/api/merchantRequest?PID=0010013654&MD=P&AMT=2600&CRN=NPR&DT=05%2F20%2F2023&PRN=VPWXLHVZSAC9-65&R1=Hotel+Booking+Payment+%7E+Roam&R2=N%2FA&DV=69d3483a090561c81175b2ddfc4579b449c1a1126de6bdb0a799d3d7d5d4234fc269d6d60ec96a31cb1af748ecb987968b80a0b014581fc41c74f37fb401690f&RU=https%3A%2F%2Fapi.roamnow.co%2Fapp%2Ftransaction%2Fverify%2Ffonepay';


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
    await page.goto(url)

    // Set screen size so that fonepay loads qr, as fonepay doesnot show qr on lower devices
    await page.setViewport({ width: 1920, height: 1080 });
    
    const qrClass = '.qr-img'
    await page.waitForSelector(qrClass, { timeout: 15000 })
    const element = await page.$(qrClass)
    const base64ImageData = await element.screenshot( { encoding: 'base64' } )
    const image = 'data:image/png;base64,' + base64ImageData
    await browser.close()

    console.log(image)

 } catch (error) {
    console.log('Expired')
    console.log(error)
 }

})();