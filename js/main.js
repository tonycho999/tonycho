document.addEventListener("DOMContentLoaded", () => {
    // 1. 언어 감지 및 설정
    const userLang = navigator.language.slice(0, 2);
    const isLangLoaded = typeof langData !== 'undefined';
    const currentLang = (isLangLoaded && langData[userLang]) ? userLang : 'en';
    
    // 텍스트 가져오기
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
            const thumbUrl = `img/${project.folderName}/screenshot1.png`;
            const pTitle = getText(project.title);
            const pDesc = getText(project.description);

            const card = document.createElement("div");
            card.className = "project-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 border border-gray-100 flex flex-col h-full";
            
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
            card.addEventListener('click', () => openProjectModal(project));
            projectsGrid.appendChild(card);
        });
    }
    
    renderProjects();

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
    
    // [추가됨] QR 코드 엘리먼트
    const qrContainer = document.getElementById('qr-container');
    const qrImg = document.getElementById('modal-qr');

    function openProjectModal(project) {
        titleEl.innerText = getText(project.title);
        descEl.innerText = getText(project.description);
        
        linkEl.href = project.link;
        linkEl.innerText = currentLang === 'ko' ? "사이트 방문하기" : "Visit Website";

        const bmcBtn = document.getElementById('bmc-btn-modal');
        if(bmcBtn) bmcBtn.href = "https://buymeacoffee.com/tonycho";

        // [QR 코드 처리 로직]
        if(qrImg && qrContainer) {
            // 초기화: 일단 숨김
            qrContainer.classList.add('hidden');
            qrImg.src = '';
            
            // 이미지 경로 설정
            const qrPath = `img/${project.folderName}/QR.png`;
            qrImg.src = qrPath;

            // 이미지가 성공적으로 로드되면 보임
            qrImg.onload = function() {
                qrContainer.classList.remove('hidden');
            };
            // 로드 실패하면(파일 없음) 계속 숨김
            qrImg.onerror = function() {
                qrContainer.classList.add('hidden');
            };
        }

        // 이미지 슬라이더 (4장 로드)
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
            
            if (imgInfo.type === 'mobile') {
                img.className = "mobile-mockup"; // style.css에 정의된 클래스 사용
            } else {
                img.className = "w-full rounded-lg shadow-md border border-gray-200 block";
            }

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
        document.body.style.overflow = 'hidden';
    }

    // 모달 닫기
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            projectModal.classList.add('hidden');
            contactModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
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
    
    // 이메일 전송 (수정됨)
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.name.value;
            const userEmail = contactForm.email.value;
            const message = contactForm.message.value;
            
            // 수신자 고정
            const recipient = "tonycho999@gmail.com";
            
            const subject = `[Portfolio Inquiry] Message from ${name}`;
            const body = `Name: ${name}\nClient Email: ${userEmail}\n\nMessage:\n${message}`;
            
            window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            setTimeout(() => {
                contactModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
                contactForm.reset();
            }, 1000);
        });
    }
});
