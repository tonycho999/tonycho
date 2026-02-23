// js/ads.js
(function() {
    // URL 파라미터 확인 (?mode=admin 또는 ?mode=logout)
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    if (mode === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        alert('🔒 관리자 모드: 광고가 차단되었습니다.');
        // 주소창 깨끗하게 정리
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (mode === 'logout') {
        localStorage.removeItem('isAdmin');
        alert('🔓 로그아웃: 광고가 다시 표시됩니다.');
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 관리자가 아닐 때만 광고 스크립트 로드
    if (!localStorage.getItem('isAdmin')) {
        const adScript = document.createElement('script');
        // 요청하신 광고 스크립트 주소
        adScript.src = "https://pl28773486.effectivegatecpm.com/ea/ea/08/eaea08ea7f3db4e03c3e22678e83d206.js";
        adScript.async = true;
        document.head.appendChild(adScript);
        console.log("📢 Visitor Mode: Ads loaded.");
    } else {
        console.log("🛡️ Admin Mode: Ads blocked.");
    }
})();
