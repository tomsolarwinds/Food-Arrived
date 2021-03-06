const puppeteer = require("puppeteer");
const axios = require('axios');
require('log-timestamp');

async function fetchActiveOrders(){
    // console.log(date.toLocaleTimeString());
    //fetch all orders from api
    const response = await axios.get('http://ec2-18-192-191-34.eu-central-1.compute.amazonaws.com:3000/ordernumbers');
    const ordersNumbers = response.data.Items.map(i => i.orderNumber);
    console.log(ordersNumbers);
    // scraping all orders from cibus
    const result = await scrapeOrdersFromCibus();
    const newOrders = result.filter(r => !ordersNumbers.includes(r.orderNumber));

    //post new orders to api
    if(newOrders.length > 0) {
        await axios.post('http://ec2-18-192-191-34.eu-central-1.compute.amazonaws.com:3000/orders/new',newOrders ).catch(err => console.log(err.message));

        console.log({newOrders});
    } else if(result.length === 0) {
        console.log('no new orders');
        const activeOrdersResponse = await axios.get('http://ec2-18-192-191-34.eu-central-1.compute.amazonaws.com:3000/orders').catch(err => console.log(err.message));
        if(activeOrdersResponse.status === 200 && activeOrdersResponse.data && activeOrdersResponse.data.length > 0){
            console.log('going to setArrived for all active orders');
           await axios.put('http://ec2-18-192-191-34.eu-central-1.compute.amazonaws.com:3000/setArrived').catch(err => console.log(err.message));
        }
    }
}

async function scrapeOrdersFromCibus(){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.mysodexo.co.il/');
    await page.type('#txtUsr', process.env.CIBUS_USER);
    await page.type('#txtPas', process.env.CIBUS_PASSWORD);
    await page.type('#txtCmp', process.env.CIBUS_COMPANY);
    let failure = false;
    await Promise.all([
        page.click('#btnLogin'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]).catch(err => {console.error(err.message); failure=true;});
    await Promise.all([
        page.goto('https://www.mysodexo.co.il/new_admin/new_food_is_here.aspx'),
        page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]).catch(err => {console.error(err.message); failure=true})

    if(failure) return;

    const result = await page.evaluate(() => {
        const data = [];
        const rows = document.querySelectorAll('#ctl00_ctl01 > div > div.main-fh > table > tbody > tr');
        let restaurant;
        let deliveryTime;
        Array.from(rows, (row) => {
            if(row.className !== 'tbl-headers' && row.className === 'hid'){
                if(restaurant && deliveryTime){
                    const deepRows = row.querySelectorAll('.deal-row');
                    Array.from(deepRows, deepRow => {
                        const columns = deepRow.querySelectorAll('td');

                        const c = Array.from(columns, column => column.innerText);
                        data.push({
                            restaurant,
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
                restaurant = c[0];
                deliveryTime = getDateFromDeliveryTime(c[1]);
            }
        });

        return data;
    });
    await browser.close();

    return result;
}

function getDateFromDeliveryTime(deliveryTime){
    const timeSplited = deliveryTime.trim().split(':');
    const date = new Date();
    date.setHours(Number(timeSplited[0]));
    date.setMinutes(Number(timeSplited[1]));
    date.setSeconds(0);

    return date;
}

async function delayedOrders(){
    const activeOrders = await axios.get('http://ec2-18-192-191-34.eu-central-1.compute.amazonaws.com:3000/orders')
    if(activeOrders && activeOrders.data.length > 0){
        const delayedOrders = []
        const currentDate = new Date();
        activeOrders.data.forEach(o => {
           if(o.deliveryTime > currentDate){
               delayedOrders.push(o);
               console.log('order delayed', o);
           }
        });
        console.log('delayed orders list:', delayedOrders);
    }
}

async function startCibusAgent() {
    await fetchActiveOrders();
    setInterval(fetchActiveOrders, process.env.CIBUS_FETCH_INTERVAL_MS);
    setInterval(delayedOrders, process.env.CIBUS_FETCH_INTERVAL_MS);
}

module.exports = {
    startCibusAgent,
}