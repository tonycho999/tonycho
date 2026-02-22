const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const sites = require('./sites.json');

(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    for (const site of sites) {
        const dir = path.join(__dirname, 'img', site.name);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        console.log(`📸 Capturing ${site.name}...`);

        // 1. PC 버전 (1920x1080)
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(site.url, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(dir, 'screenshot1.png') });

        // 2. 모바일 버전 (iPhone 13 PRO 크기)
        await page.setViewport({ width: 390, height: 844, isMobile: true });
        await page.goto(site.url, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(dir, 'screenshot_mobile.png') });
    }

    await browser.close();
    console.log('✅ All screenshots captured successfully!');
})();
