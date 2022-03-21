const puppeteer = require('puppeteer');
require('dotenv').config();

(async () => {
    const ithelp_url = process.env.ITHELP_URL || "https://google.com/"
    const browser = await puppeteer.launch({
        headless: process.env.HEADLESS == "false" ? false : true,
    });

    let total_likes = 0
    let total_responses = 0
    let total_views = 0
    let p = 0
    //end = false時while迴圈會中斷
    let end = true
    const page = await browser.newPage();
    const tablet = puppeteer.devices['iPad landscape']
    await page.emulate(tablet)
    while (end) {
        p == 0 ? await page.goto(ithelp_url) : await page.goto(ithelp_url + `?page=` + p);
        await page.waitForSelector('.profile-header__name')

        let elements = await page.$$('.qa-condition__count')
        if (elements.length > 0) {
            for (var i = 0; i < elements.length; i++) {
                let tmp_text = await page.evaluate(el => el.textContent, elements[i])
                if (i % 3 == 0) {
                    total_likes += parseInt(tmp_text)
                } else if (i % 3 == 1) {
                    total_responses += parseInt(tmp_text)
                } else if (i % 3 == 2) {
                    total_views += parseInt(tmp_text)
                }
            }
        } else {
            await browser.close();
            end = false
        }
        p++
    }
    console.log({ "toal likes": total_likes, "toal responses": total_responses, "toal views": total_views })
})();