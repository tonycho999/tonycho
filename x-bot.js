require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');

// 프로젝트 데이터
const sites = require('./sites.json');

// 1. API 설정
const client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_SECRET,
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 2. 52세 개발자 페르소나 (네트워크 엔지니어 경력 반영)
const SYSTEM_PROMPT = `
You are a 52-year-old Korean indie developer living in the Philippines.
You are writing a tweet for your X (Twitter) account to build an audience of fellow developers.

**Your Biography (The True Timeline):**
- **The Spark (Age 14-16):**
    - Saw a computer for the first time at 14. Learned GW-Basic, COBOL, Pascal, C, Fortran at 16.
- **University & Early Career (Korea):**
    - Majored in **Electronic Engineering** (wanted CS but grades...). Learned C++ and AutoCAD.
    - Worked at an **Electronic Circuit Design** company for 1 year.
- **The Move & Career in Philippines:**
    - Moved to PH for ESL, then settled down.
    - Worked at a **BPO company** for 3 years.
    - Worked as a **Network Engineer** at an **ISP (Internet Service Provider)** for many years.
    - **Expertise:** You are good with hardware, circuits, and networks.
- **The Crisis (Pandemic):**
    - The ISP company closed down due to COVID-19. You lost your job.
- **The Code Restart (Age ~48):**
    - Returned to coding after 35 years. Self-taught **Kotlin**.
    - Released Android apps -> Made revenue -> **Account Suspended** (Policy mistake).
- **The Pivot (Current, Age 52):**
    - Switched to **Web Development** (Frontend/Backend).
    - Building with React, Vue, Firebase.
    - **Struggle:** You find CSS/UI harder than Network Engineering.

**Your Tone:**
- Experienced but humble. You compare "managing ISP networks" vs "centering a div in CSS".
- Resilient. From Circuit Design -> Network Eng -> App Dev -> Web Dev.
- Write in **ENGLISH**.
- Keep it under 260 characters.
- Use hashtags: #IndieDev #BuildInPublic #NetworkEngineer #WebDev
`;

async function run() {
    try {
        console.log("🚀 X(트위터) 봇 시작...");

        // 3. 모드 결정 (30% 확률로 인생 스토리, 70% 확률로 프로젝트 홍보)
        const isStoryMode = Math.random() < 0.3; 

        let prompt = "";
        let imagePath = null;
        let selectedProject = null;

        if (isStoryMode) {
            // [모드 A] 인생 스토리 (Journey)
            console.log("📖 모드: 인생 스토리 작성 중...");
            prompt = `
            Write a short, personal tweet about my career journey.
            
            Pick ONE specific topic:
            1. Transition from Circuit Design (Korea) -> Network Engineer (ISP in PH) -> Web Dev.
            2. How managing an ISP network is different from building a React app.
            3. The shock of the ISP closing down during the pandemic and forcing me to code again.
            4. Learning COBOL at 16 vs Learning JavaScript at 52.
            5. BPO life vs Coding life.
            
            Make it inspiring and relatable to older devs or career switchers.
            `;
        } else {
            // [모드 B] 프로젝트 개발 일지 (Dev Log)
            console.log("💻 모드: 프로젝트 개발 일지 작성 중...");
            
            selectedProject = sites[Math.floor(Math.random() * sites.length)];
            console.log(`🎯 선택된 프로젝트: ${selectedProject.name}`);

            imagePath = path.join(__dirname, 'img', selectedProject.name, 'screenshot1.png');
            
            if (!fs.existsSync(imagePath)) {
                console.log("⚠️ 이미지가 없어서 텍스트 스토리로 전환합니다.");
                imagePath = null;
                // 이미지가 없을 때: 네트워크 엔지니어 관점의 웹 개발 이야기
                prompt = "Write a tweet about how being a Network Engineer helps (or doesn't help) with Frontend development.";
            } else {
                // 프로젝트 홍보 프롬프트
                prompt = `
                I built this web project: "${selectedProject.name}" (${selectedProject.url}).
                
                Write a tweet that sounds like a "Dev Log".
                Highlight my background as a former **Network Engineer** or **Electronics Major**.
                
                Narrative structure:
                1. Intro the project.
                2. A struggle (e.g., "I used to configure ISP routers, but CSS Grid confuses me" or "Database logic is like circuit design").
                3. How I solved it.
                4. Hashtags.
                `;
            }
        }

        // 4. Groq AI에게 글 작성 요청
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt }
            ],
            model: "llama3-70b-8192",
            temperature: 0.85,
        });

        const tweetText = chatCompletion.choices[0]?.message?.content || "";
        console.log(`📝 생성된 트윗:\n${tweetText}\n`);

        // 5. 트윗 전송
        if (imagePath) {
            console.log("📤 이미지 업로드 중...");
            const mediaId = await client.v1.uploadMedia(imagePath);
            await client.v2.tweet({
                text: tweetText,
                media: { media_ids: [mediaId] }
            });
        } else {
            console.log("🐦 텍스트 트윗 전송 중...");
            await client.v2.tweet(tweetText);
        }

        console.log("✅ 전송 완료!");

    } catch (error) {
        console.error("❌ 에러 발생:", error);
        process.exit(1);
    }
}

run();
