const puppeteer = require("puppeteer");

async function fetchActiveOrders(){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.mysodexo.co.il/');
    await page.type('#txtUsr', 'גיא פריימן');
    await page.type('#txtPas', 'batso147');
    await page.type('#txtCmp', 'סולארוינדס');
    await Promise.all([
        page.click('#btnLogin'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await page.goto('https://www.mysodexo.co.il/new_my/new_my_details.aspx');
    await browser.close();
}
async function startCibusAgent() {
    await fetchActiveOrders();
    setInterval(fetchActiveOrders, 15000);
}

module.exports = {
    startCibusAgent,
}