// js/projects.js

const projectData = [
    {
        id: "world-qr-code",
        folderName: "world-qr-code", // sites.json의 name과 일치해야 함
        category: "tool",
        title: { en: "World QR Code Generator", ko: "만능 QR 코드 생성기" },
        description: { 
            en: "A global QR code generation tool accessible anywhere.", 
            ko: "어디서든 접속 가능한 글로벌 QR 코드 생성 도구입니다." 
        },
        tech: ["JavaScript", "API"],
        link: "https://world-qr-code.web.app/"
    },
    {
        id: "word-master9",
        folderName: "word-master9",
        category: "game",
        title: { en: "Word Master 9", ko: "워드 마스터 9" },
        description: { 
            en: "An engaging word puzzle game to test your vocabulary.", 
            ko: "어휘력을 테스트할 수 있는 흥미진진한 단어 퍼즐 게임입니다." 
        },
        tech: ["Game Logic", "CSS3"],
        link: "https://word-master9.vercel.app/"
    },
    {
        id: "possystem",
        folderName: "possystem",
        category: "web",
        title: { en: "Cloud POS System", ko: "클라우드 POS 시스템" },
        description: { 
            en: "Comprehensive store management system with inventory tracking.", 
            ko: "재고 추적 기능이 포함된 매장 통합 관리 시스템입니다." 
        },
        tech: ["React", "Firebase", "Stripe"],
        link: "https://store-theta-sandy.vercel.app"
    },
    {
        id: "alpha-z-puzzle",
        folderName: "Alpha-Z-puzzle", // 대소문자 주의 (sites.json과 동일)
        category: "game",
        title: { en: "Alpha Z Puzzle", ko: "알파 Z 퍼즐" },
        description: { 
            en: "A challenging alphabet puzzle game for all ages.", 
            ko: "남녀노소 즐길 수 있는 알파벳 퍼즐 게임입니다." 
        },
        tech: ["Algorithm", "Interactive"],
        link: "https://alpha-z.pages.dev/"
    },
    {
        id: "hrproject",
        folderName: "HRproject",
        category: "system",
        title: { en: "HR Management System", ko: "인사 관리(HR) 시스템" },
        description: { 
            en: "Employee management platform for HR departments.", 
            ko: "인사 부서를 위한 직원 관리 및 조직 관리 플랫폼입니다." 
        },
        tech: ["Web App", "Database"],
        link: "https://hrproject-744f0.web.app/"
    }
];
