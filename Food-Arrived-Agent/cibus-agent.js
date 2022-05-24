const puppeteer = require("puppeteer");

async function fetchActiveOrders(){
    //fetch all orders from api

    // scraping all orders from cibus
    const result = await scrapeOrdersFromCibus();

    //post new orders to api
    console.log({result});

}

async function scrapeOrdersFromCibus(){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.mysodexo.co.il/');
    await page.type('#txtUsr', process.env.CIBUS_USER);
    await page.type('#txtPas', process.env.CIBUS_PASSWORD);
    await page.type('#txtCmp', process.env.CIBUS_COMPANY);
    await Promise.all([
        page.click('#btnLogin'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await Promise.all([
        page.goto('https://www.mysodexo.co.il/new_admin/new_food_is_here.aspx'),
        page.waitForNavigation({ waitUntil: 'networkidle0' })
    ])


    const result = await page.evaluate(() => {
        const data = [];
        const rows = document.querySelectorAll('#ctl00_ctl01 > div > div.main-fh > table > tbody > tr');
        let restName;
        let deliveryTime;
        Array.from(rows, (row) => {
            if(row.className !== 'tbl-headers' && row.className === 'hid'){
                if(restName && deliveryTime){
                    const deepRows = row.querySelectorAll('.deal-row');
                    Array.from(deepRows, deepRow => {
                        const columns = deepRow.querySelectorAll('td');

                        const c = Array.from(columns, column => column.innerText);
                        data.push({
                            restName,
                            deliveryTime,
                            orderNumber: c[1].split(',')[0],
                            firstName: c[2],
                            lastName: c[3],
                        });
                    })
                }
            }
            else if(row.className !== 'tbl-headers'){
                const columns = row.querySelectorAll('td');
                const c = Array.from(columns, column => column.innerText);
                restName = c[0];
                deliveryTime = c[1];
            }
        });

        return data;
    });
    await browser.close();

    return result;
}

async function startCibusAgent() {
    await fetchActiveOrders();
    setInterval(fetchActiveOrders, process.env.CIBUS_FETCH_INTERVAL_MS);
}

module.exports = {
    startCibusAgent,
}