const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const sites = require('./sites.json');

// GitHub Secrets에서 계정 정보 로드 (로그인 필요 사이트용)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

(async () => {
    // 브라우저 실행 (GitHub Actions 환경을 위한 설정)
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    for (const site of sites) {
        try {
            const dir = path.join(__dirname, 'img', site.name);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            console.log(`🚀 [${site.name}] 접속 중...`);
            
            // 1. 사이트 이동
            await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 60000 });

            // 2. 로그인 처리 (필요한 경우)
            if (site.needsLogin) {
                console.log(`🔑 [${site.name}] 로그인 시도 중...`);
                // 공통 선택자 (대부분의 로그인 폼에서 작동)
                await page.type('input[type="email"], input[name="email"], input#email', ADMIN_EMAIL);
                await page.type('input[type="password"], input[name="password"], input#password', ADMIN_PASSWORD);
                await page.click('button[type="submit"], .login-button, #login-btn');
                
                // 로그인 후 페이지 전환 대기
                await page.waitForNavigation({ waitUntil: 'networkidle2' });
                console.log(`✅ [${site.name}] 로그인 성공!`);
            }

            // --- 스크린샷 캡처 (총 2장) ---

            // 📸 1. PC 버전 (1440 x 900)
            console.log(`📸 [${site.name}] PC 버전 캡처 중...`);
            await page.setViewport({ width: 1440, height: 900 });
            // 약간의 대기 시간을 주어 애니메이션 등이 멈춘 뒤 촬영
            await new Promise(r => setTimeout(r, 2000)); 
            await page.screenshot({ 
                path: path.join(dir, 'screenshot1.png'),
                fullPage: false // 상단 핵심 영역만 캡처
            });

            // 📱 2. 모바일 버전 (375 x 812)
            console.log(`📱 [${site.name}] 모바일 버전 캡처 중...`);
            await page.setViewport({ width: 375, height: 812, isMobile: true });
            await new Promise(r => setTimeout(r, 2000));
            await page.screenshot({ 
                path: path.join(dir, 'screenshot_mobile.png'),
                fullPage: false
            });

            console.log(`✔️ [${site.name}] 모든 스크린샷 저장 완료.`);
        } catch (error) {
            console.error(`❌ [${site.name}] 작업 중 에러 발생:`, error.message);
        }
    }

    await browser.close();
    console.log('🏁 모든 사이트 캡처 작업이 종료되었습니다!');
})();
