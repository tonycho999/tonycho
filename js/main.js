// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. 언어 감지 및 설정 (lang.js가 먼저 로드되어 있어야 함)
    const userLang = navigator.language.slice(0, 2);
    // langData가 없으면 에러 방지를 위해 빈 객체 처리
    const isLangLoaded = typeof langData !== 'undefined';
    const currentLang = (isLangLoaded && langData[userLang]) ? userLang : 'en';
    
    // 텍스트 가져오기 헬퍼 함수
    function getText(data) {
        if (typeof data === 'string') return data;
        return data[currentLang] || data['en'] || "";
    }

    // UI 언어 적용
    function applyUILanguage() {
        if (!isLangLoaded) return;
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
    
    // projectData가 로드되었는지 확인
    if (typeof projectData === 'undefined') {
        console.error("Error: projectData is not loaded. Check js/projects.js");
        return;
    }

    function renderProjects(filter = 'all') {
        projectsGrid.innerHTML = '';
        const filtered = filter === 'all' 
            ? projectData 
            : projectData.filter(p => p.category === filter);

        filtered.forEach(project => {
            // 봇이 찍은 'screenshot1.png' (PC 메인)을 썸네일로 사용
            const thumbUrl = `img/${project.folderName}/screenshot1.png`;
            const pTitle = getText(project.title);
            const pDesc = getText(project.description);

            const card = document.createElement("div");
            card.className = "project-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 border border-gray-100 flex flex-col h-full";
            
            // [이미지 로딩] onerror 처리로 무한 로딩 방지
            card.innerHTML = `
                <div class="h-48 bg-gray-100 overflow-hidden relative border-b border-gray-100">
                    <img 
                        src="${thumbUrl}" 
                        alt="${pTitle}" 
                        class="w-full h-full object-cover object-top" 
                        onerror="this.onerror=null; this.src='https://placehold.co/600x400?text=Preparing...';"
                    >
                    <span class="absolute top-2 right-2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold shadow-sm tracking-wide">${project.category}</span>
                </div>
                <div class="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <h4 class="font-bold text-lg mb-2 text-gray-800 leading-tight">${pTitle}</h4>
                        <p class="text-gray-500 text-sm line-clamp-2 mb-4 h-10">${pDesc}</p>
                    </div>
                    <div class="flex gap-1 flex-wrap">
                        ${project.tech.map(t => `<span class="bg-gray-50 text-gray-600 border border-gray-200 text-xs px-2 py-1 rounded font-medium">${t}</span>`).join('')}
                    </div>
                </div>
            `;
            // 카드 클릭 시 상세 모달 열기
            card.addEventListener('click', () => openProjectModal(project));
            projectsGrid.appendChild(card);
        });
    }
    
    renderProjects();

    // 3. 필터 버튼 이벤트
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 버튼 스타일 초기화
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white', 'border-transparent');
                b.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
            });
            // 선택된 버튼 스타일 적용
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

    function openProjectModal(project) {
        titleEl.innerText = getText(project.title);
        descEl.innerText = getText(project.description);
        
        linkEl.href = project.link;
        linkEl.innerText = currentLang === 'ko' ? "사이트 방문하기" : "Visit Website";

        // Buy Me a Coffee 버튼 링크 연결
        const bmcBtn = document.getElementById('bmc-btn-modal');
        if(bmcBtn) bmcBtn.href = "https://buymeacoffee.com/tonycho";

        // 봇이 생성한 4장의 이미지 로드 순서 정의
        sliderEl.innerHTML = '';
        const imagesToLoad = [
            { name: 'screenshot1.png', type: 'pc', label: 'Main View' },
            { name: 'screenshot_mobile1.png', type: 'mobile', label: 'Mobile Main' },
            { name: 'screenshot2.png', type: 'pc', label: 'Detail View' },
            { name: 'screenshot_mobile2.png', type: 'mobile', label: 'Mobile Detail' }
        ];

        imagesToLoad.forEach(imgInfo => {
            const imgPath = `img/${project.folderName}/${imgInfo.name}`;
            const imgWrapper = document.createElement('div');
            imgWrapper.className = "mb-10 text-center relative group";

            const img = document.createElement('img');
            img.src = imgPath;
            
            // 스타일 분기: 모바일은 스마트폰 목업 느낌, PC는 전체 화면
            if (imgInfo.type === 'mobile') {
                img.className = "max-w-[280px] mx-auto rounded-[2.5rem] border-[6px] border-gray-800 shadow-2xl block";
            } else {
                img.className = "w-full rounded-lg shadow-md border border-gray-200 block";
            }

            // [중요] 이미지가 없으면 해당 섹션 숨김 (에러 로그 없이 깔끔하게 처리)
            img.onerror = function() { 
                this.onerror = null; 
                imgWrapper.style.display = 'none'; 
            };

            const label = document.createElement('p');
            label.className = "text-gray-400 text-xs mt-3 uppercase tracking-widest font-semibold";
            label.innerText = imgInfo.label;

            imgWrapper.appendChild(img);
            imgWrapper.appendChild(label);
            sliderEl.appendChild(imgWrapper);
        });

        projectModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // 배경 스크롤 잠금
    }

    // 닫기 버튼 공통 처리
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            projectModal.classList.add('hidden');
            contactModal.classList.add('hidden');
            document.body.style.overflow = 'auto'; // 스크롤 잠금 해제
        });
    });

    // Contact 모달 열기
    const openContactBtn = document.getElementById('open-contact');
    if(openContactBtn) {
        openContactBtn.addEventListener('click', () => {
            contactModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // 이메일 전송 (mailto 방식)
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.name.value;
            const email = contactForm.email.value;
            const message = contactForm.message.value;
            
            const subject = `[Portfolio Inquiry] Message from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            
            window.location.href = `mailto:tonycho999@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            setTimeout(() => {
                contactModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
                contactForm.reset();
            }, 1000);
        });
    }
});
