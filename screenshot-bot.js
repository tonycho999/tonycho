const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const sites = require('./sites.json');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });

    const page = await browser.newPage();

    for (const site of sites) {
        try {
            const dir = path.join(__dirname, 'img', site.name);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            console.log(`🚀 [${site.name}] 작업 시작...`);
            await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 60000 });

            if (site.needsLogin) {
                console.log(`🔑 [${site.name}] 로그인 중...`);
                await page.type('input[type="email"], input[name="email"], input#email', ADMIN_EMAIL);
                await page.type('input[type="password"], input[name="password"], input#password', ADMIN_PASSWORD);
                await page.click('button[type="submit"], .login-button, #login-btn');
                await page.waitForNavigation({ waitUntil: 'networkidle2' });
            }

            // 📸 1. 메인 화면 캡처 (PC/모바일)
            await page.setViewport({ width: 1440, height: 900 });
            await new Promise(r => setTimeout(r, 2000));
            await page.screenshot({ path: path.join(dir, 'screenshot1.png') });

            await page.setViewport({ width: 375, height: 812, isMobile: true });
            await new Promise(r => setTimeout(r, 2000));
            await page.screenshot({ path: path.join(dir, 'screenshot_mobile1.png') });

            // 📸 2. 다른 화면 이동 후 캡처
            if (site.secondUrl) {
                await page.goto(site.secondUrl, { waitUntil: 'networkidle2' });
                
                await page.setViewport({ width: 1440, height: 900 });
                await page.screenshot({ path: path.join(dir, 'screenshot2.png') });

                await page.setViewport({ width: 375, height: 812, isMobile: true });
                await page.screenshot({ path: path.join(dir, 'screenshot_mobile2.png') });
            }

            console.log(`✅ [${site.name}] 완료`);
        } catch (error) {
            console.error(`❌ [${site.name}] 실패:`, error.message);
        }
    }

    await browser.close();
})();
