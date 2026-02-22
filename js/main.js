document.addEventListener("DOMContentLoaded", () => {
    // 1. 언어 감지 및 설정
    const userLang = navigator.language.slice(0, 2); // 브라우저 언어 감지
    const currentLang = langData[userLang] ? userLang : 'en'; // 지원 안 하면 영어
    
    // [중요] 다국어 텍스트 선택 헬퍼 함수
    // 데이터가 {en:"...", ko:"..."} 형태면 현재 언어 반환, 없으면 영어 반환
    function getText(data) {
        if (typeof data === 'string') return data;
        return data[currentLang] || data['en'] || "";
    }

    // UI 텍스트 적용 (lang.js 기반)
    function applyUILanguage() {
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (langData[currentLang][key]) {
                el.innerText = langData[currentLang][key];
            }
        });
    }
    applyUILanguage();

    // 2. 프로젝트 렌더링
    const projectsGrid = document.getElementById("projects-grid");
    
    function renderProjects(filter = 'all') {
        projectsGrid.innerHTML = '';
        const filtered = filter === 'all' 
            ? projectData 
            : projectData.filter(p => p.category === filter);

        filtered.forEach(project => {
            const thumbUrl = `img/${project.folderName}/screenshot1.png`;
            const pTitle = getText(project.title); // 언어에 맞는 제목
            const pDesc = getText(project.description); // 언어에 맞는 설명

            const card = document.createElement("div");
            card.className = "project-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 border border-gray-100";
            card.innerHTML = `
                <div class="h-48 bg-gray-200 overflow-hidden relative">
                    <img src="${thumbUrl}" alt="${pTitle}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                    <span class="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded uppercase font-bold shadow-md">${project.category}</span>
                </div>
                <div class="p-6">
                    <h4 class="font-bold text-lg mb-2 text-gray-800">${pTitle}</h4>
                    <p class="text-gray-600 text-sm line-clamp-2">${pDesc}</p>
                    <div class="mt-4 flex gap-2 flex-wrap">
                        ${project.tech.map(t => `<span class="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded font-medium">${t}</span>`).join('')}
                    </div>
                </div>
            `;
            // 클릭 시 팝업 열기
            card.addEventListener('click', () => openProjectModal(project));
            projectsGrid.appendChild(card);
        });
    }
    
    renderProjects(); // 초기 실행

    // 3. 필터 버튼 이벤트
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white', 'border-transparent');
                b.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
            });
            e.target.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
            e.target.classList.add('bg-blue-600', 'text-white', 'border-transparent');
            
            renderProjects(e.target.dataset.category);
        });
    });

    // 4. 모달(팝업) 로직
    const projectModal = document.getElementById('project-modal');
    const contactModal = document.getElementById('contact-modal');
    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-desc');
    const linkEl = document.getElementById('modal-link');
    const sliderEl = document.getElementById('modal-slider');

    // 프로젝트 모달 열기
    function openProjectModal(project) {
        titleEl.innerText = getText(project.title);
        descEl.innerText = getText(project.description);
        linkEl.href = project.link;

        // 이미지 생성
        sliderEl.innerHTML = '';
        for(let i=1; i<=project.imageCount; i++) {
            const img = document.createElement('img');
            img.src = `img/${project.folderName}/screenshot${i}.png`;
            img.className = "w-full rounded-lg mb-4 shadow-sm border border-gray-100";
            img.onerror = function() { this.style.display='none'; };
            sliderEl.appendChild(img);
        }

        projectModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // 배경 스크롤 막기
    }

    // 닫기 버튼 공통 처리
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            projectModal.classList.add('hidden');
            contactModal.classList.add('hidden');
            document.body.style.overflow = 'auto'; // 스크롤 풀기
        });
    });

    // 이메일 모달 열기
    document.getElementById('open-contact').addEventListener('click', () => {
        contactModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
    
    // 이메일 전송 (mailto)
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.name.value;
        const email = contactForm.email.value;
        const message = contactForm.message.value;
        
        const subject = `[Portfolio Inquiry] Message from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        
        // 메일 클라이언트 실행
        window.location.href = `mailto:tonycho@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        setTimeout(() => {
            contactModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 1000);
    });
});
