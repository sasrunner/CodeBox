const url = 'https://www.google.com';
const puppeteer = require('puppeteer');

(async () => {
    // connect to Chrome
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:7926', // debug endpoint
        defaultViewport: null,
    });
    
    const pages = await browser.pages();
    console.log('NOTE: Pages currently open:', pages.map(p => p.url()));

    let page = pages.find(p => p.url().includes(url));

    if (page) {
        console.log('NOTE: Attaching existing page:', page.url());
        await page.bringToFront();
    } else {
        console.log('NOTE: Creating new one...');
        page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 });
    }

    // DO SOMETHING

    browser.disconnect();
})().catch(err => {
    console.log("ERROR occurs.");
    console.error(err);
    process.exit(1);
});