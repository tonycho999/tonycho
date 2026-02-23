const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const sites = require('./sites.json');

// GitHub Secrets에서 계정 정보 가져오기
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    for (const site of sites) {
        const dir = path.join(__dirname, 'img', site.name);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        console.log(`📸 Capturing ${site.name}...`);
        await page.goto(site.url, { waitUntil: 'networkidle2' });

        // [추가] 로그인이 필요한 사이트인지 체크 (sites.json에 needsLogin: true 설정)
        if (site.needsLogin) {
            console.log(`🔑 Logging in to ${site.name}...`);
            // 사이트별 input 선택자에 맞게 수정이 필요할 수 있습니다.
            await page.type('input[type="email"], input[name="email"]', ADMIN_EMAIL);
            await page.type('input[type="password"]', ADMIN_PASSWORD);
            await page.click('button[type="submit"], .login-button'); // 로그인 버튼 클릭
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
        }

        // 화면 크기 조절 후 캡처
        await page.setViewport({ width: 1920, height: 1080 });
        await page.screenshot({ path: path.join(dir, 'screenshot1.png'), fullPage: true });
    }

    await browser.close();
})();
