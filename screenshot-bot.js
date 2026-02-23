const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
// sites.json 파일이 같은 폴더에 있어야 합니다.
const sites = require('./sites.json');

// GitHub Secrets에서 설정한 아이디/비번 가져오기
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

(async () => {
    // 1. 브라우저 실행 (GitHub Actions 최적화 옵션)
    const browser = await puppeteer.launch({
        headless: "new",
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
            console.log(`\n🚀 [${site.name}] 작업 시작...`);
            
            // 이미지 저장 폴더 생성
            const dir = path.join(__dirname, 'img', site.name);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            // ---------------------------------------------------------
            // 🌐 사이트 접속
            // ---------------------------------------------------------
            console.log(`   Running: 접속 중... (${site.url})`);
            await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 60000 });

            // ---------------------------------------------------------
            // 🔑 로그인 (필요한 경우만)
            // ---------------------------------------------------------
            if (site.needsLogin) {
                console.log(`   🔑 로그인 시도 중...`);
                
                // 이메일 입력
                await page.type('input[type="email"], input[name="email"]', ADMIN_EMAIL, { delay: 50 });
                // 비밀번호 입력
                await page.type('input[type="password"], input[name="password"]', ADMIN_PASSWORD, { delay: 50 });
                
                // 로그인 버튼 클릭 후 대기
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
                    page.click('button[type="submit"], .login-btn, #login-button, button')
                ]).catch(e => console.log("   ⚠️ 로그인 후 네비게이션 타임아웃 (넘어가도 무방할 수 있음)"));
                
                console.log(`   ✅ 로그인 완료 (메인 화면 진입)`);
            }

            // ---------------------------------------------------------
            // 📸 스크린샷 1: PC 버전 (1440 x 900)
            // ---------------------------------------------------------
            await page.setViewport({ width: 1440, height: 900 });
            await new Promise(r => setTimeout(r, 2000)); // 렌더링 안정화 대기
            await page.screenshot({ path: path.join(dir, 'screenshot1.png') });
            console.log(`   📸 PC 버전 저장 완료`);

            // ---------------------------------------------------------
            // 📱 스크린샷 2: 모바일 버전 (iPhone 13 기준)
            // ---------------------------------------------------------
            await page.setViewport({ width: 375, height: 812, isMobile: true });
            await new Promise(r => setTimeout(r, 1000));
            await page.screenshot({ path: path.join(dir, 'screenshot_mobile1.png') });
            console.log(`   📱 모바일 버전 저장 완료`);

        } catch (error) {
            console.error(`   ❌ [ERROR] ${site.name} 실패:`, error.message);
        }
    }

    await browser.close();
    console.log('\n🏁 모든 작업이 완료되었습니다!');
})();
