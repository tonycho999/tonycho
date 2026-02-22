/* [작성 가이드]
 1. title, description은 { en: "영어", ko: "한국어" } 형태로 작성하세요.
 2. 다른 언어가 필요하면 ja: "일본어" 처럼 추가하면 됩니다.
 3. folderName은 img 폴더 안의 실제 폴더 이름과 같아야 합니다.
*/

const projectData = [
    {
        id: "pos-system",
        category: "admin", // admin, media, utility, game
        folderName: "possystem",
        imageCount: 3, // 스크린샷 개수
        link: "https://store-theta-sandy.vercel.app",
        tech: ["React", "Firebase", "Tailwind"],
        title: {
            en: "Sweet Cakes POS",
            ko: "스윗 케이크 POS 시스템"
        },
        description: {
            en: "Web-based POS system for inventory tracking and sales management. Supports real-time data sync.",
            ko: "재고 관리 및 판매 추적을 위한 웹 기반 POS 시스템입니다. 실시간 데이터 동기화를 지원하여 매장 관리를 효율적으로 돕습니다."
        }
    },
    {
        id: "hr-terminal",
        category: "admin",
        folderName: "hrproject",
        imageCount: 2,
        link: "https://hrproject-744f0.web.app",
        tech: ["Vue.js", "Node.js", "PWA"],
        title: {
            en: "HR Mobile Terminal",
            ko: "인사관리 모바일 터미널"
        },
        description: {
            en: "Mobile-optimized web app for employee attendance and schedule management.",
            ko: "직원들의 출퇴근 기록 및 스케줄 관리를 위한 모바일 최적화 웹앱입니다. GPS 기반 체크인 기능을 포함합니다."
        }
    },
    {
        id: "safegate",
        category: "admin",
        folderName: "safegate",
        imageCount: 2,
        link: "https://safe-gate-ph.vercel.app",
        tech: ["React", "Supabase", "Admin Dashboard"],
        title: {
            en: "SafeGate Visitor System",
            ko: "SafeGate 방문자 관리"
        },
        description: {
            en: "Security system to manage building visitor logs and access control.",
            ko: "건물 및 회사의 방문자 출입 기록을 디지털로 관리하고 보안을 강화하는 시스템입니다."
        }
    },
    {
        id: "news-intel",
        category: "utility",
        folderName: "news",
        imageCount: 1,
        link: "https://news9-one.vercel.app",
        tech: ["Next.js", "AI API", "News API"],
        title: {
            en: "PH News Intel",
            ko: "필리핀 뉴스 인텔리전스"
        },
        description: {
            en: "AI-powered news analysis tool. Search keywords and get summarized insights.",
            ko: "AI를 활용하여 필리핀 주요 뉴스를 분석하고 키워드별로 요약된 인사이트를 제공하는 도구입니다."
        }
    },
    {
        id: "webphone",
        category: "admin",
        folderName: "webphone",
        imageCount: 1,
        link: "https://webphone-one.vercel.app",
        tech: ["WebRTC", "Socket.io", "Express"],
        title: {
            en: "WebPhone Admin Panel",
            ko: "웹폰 관리자 패널"
        },
        description: {
            en: "Admin dashboard for WebRTC-based calling system. Manage users and call logs.",
            ko: "WebRTC 기반 웹 전화 시스템의 관리자 페이지입니다. 사용자 관리 및 통화 기록 조회가 가능합니다."
        }
    },
    {
        id: "imagify",
        category: "media",
        folderName: "imagify",
        imageCount: 1,
        link: "https://imagify-pro.pages.dev",
        tech: ["WASM", "FFmpeg", "JS"],
        title: {
            en: "Imagify Pro",
            ko: "Imagify Pro (미디어 변환기)"
        },
        description: {
            en: "Browser-based media converter. Create GIFs, convert formats without installation.",
            ko: "설치 없이 브라우저에서 바로 사용하는 이미지/비디오 변환 및 GIF 메이커입니다."
        }
    },
    {
        id: "camera-app",
        category: "media",
        folderName: "yeppeuncamera",
        imageCount: 1,
        link: "https://yeppeuncamera.pages.dev",
        tech: ["Canvas API", "MediaStream"],
        title: {
            en: "Yeppeun Camera",
            ko: "예쁜 카메라"
        },
        description: {
            en: "Web-based camera app with filters and frames.",
            ko: "다양한 필터와 프레임을 제공하는 웹 기반 카메라 어플리케이션입니다."
        }
    },
    {
        id: "word-master",
        category: "game",
        folderName: "wordmaster",
        imageCount: 1,
        link: "https://word-master9.vercel.app",
        tech: ["Gamification", "JS"],
        title: {
            en: "Word Master",
            ko: "워드 마스터 (단어 게임)"
        },
        description: {
            en: "Interactive English vocabulary game with leveling system.",
            ko: "영어 단어 학습을 위한 인터랙티브 게임입니다. 레벨 시스템과 점수 기록 기능이 있습니다."
        }
    }
];
