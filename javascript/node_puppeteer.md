Command to start chrome.
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=7926 --user-data-dir="C:\Temp\Chrome_node"
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=7926 --remote-debugging-address=0.0.0.0 --user-data-dir="C:\Temp\Chrome_node"

1. install node.js windows
2. update environment variable PATH: C:\Program Files\nodejs\
3. add environment variable NODE_PATH: %APPDATA%\npm\node_modules
4. in CMD, run commands:
npm init -y
npm install -g puppeteer
npm install -g axios tough-cookie axios-cookiejar-support
npm install -g @dotenvx/dotenvx --save

5.
// Start new Chrome with debug port open
const { spawn } = require('child_process');
const puppeteer = require('puppeteer');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--remote-debugging-port=7926',
  '--user-data-dir=C:\\Temp\\Chrome_node',
  // If connecting from WSL/another host:
  // '--remote-debugging-address=0.0.0.0',
], { detached: true, stdio: 'ignore' });

// Allow child Chrome to run after Node exits
chrome.unref();

// Kill parent Chrome
chrome.kill('SIGKILL');

const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:7926', // debug endpoint
    defaultViewport: null,
});

6.
// Connect to existing Chrome    
const pages = await browser.pages();
console.log('Pages currently open:', pages.map(p => p.url()));

const url = 'https://www.google.com'

let page = pages.find(p => p.url().includes('https://www.google.com/'));

if (page) {
    console.log('Found existing CBC page:', page.url());
    await page.bringToFront();   // optional: focus it
} else {
    console.log('No page open, creating new one...');
    page = await browser.newPage();
    await page.goto('https://www.cbc.ca/news', { waitUntil: 'domcontentloaded', timeout: 90_000 });
}

// do something

browser.disconnect();

7.
How to check if the chrome startup options:
chrome://version