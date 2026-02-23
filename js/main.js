document.addEventListener("DOMContentLoaded", () => {
    // 1. 언어 감지 및 설정 (기존 동일)
    const userLang = navigator.language.slice(0, 2);
    const currentLang = langData[userLang] ? userLang : 'en';
    
    function getText(data) {
        if (typeof data === 'string') return data;
        return data[currentLang] || data['en'] || "";
    }

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
            // 봇이 찍은 첫 번째 PC 화면을 썸네일로 사용
            const thumbUrl = `img/${project.folderName}/screenshot1.png`;
            const pTitle = getText(project.title);
            const pDesc = getText(project.description);

            const card = document.createElement("div");
            // 카드 디자인 유지
            card.className = "project-card bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 border border-gray-100 flex flex-col h-full";
            card.innerHTML = `
                <div class="h-48 bg-gray-100 overflow-hidden relative border-b border-gray-100">
                    <img src="${thumbUrl}" alt="${pTitle}" class="w-full h-full object-cover object-top" onerror="this.src='https://via.placeholder.com/400x300?text=Preparing...'">
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

    // 3. 필터 버튼 이벤트 (기존 동일)
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

    // 4. 모달(팝업) 로직 [핵심 수정 부분]
    const projectModal = document.getElementById('project-modal');
    const contactModal = document.getElementById('contact-modal');
    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-desc');
    const linkEl = document.getElementById('modal-link'); // 프로젝트 바로가기 버튼
    const sliderEl = document.getElementById('modal-slider');
    const supportBtnContainer = document.getElementById('modal-actions'); // 버튼들이 들어갈 컨테이너 (HTML 확인 필요)

    function openProjectModal(project) {
        titleEl.innerText = getText(project.title);
        descEl.innerText = getText(project.description);
        
        // [수정] 프로젝트 바로가기 버튼 설정
        linkEl.href = project.link;
        linkEl.innerText = currentLang === 'ko' ? "사이트 방문하기" : "Visit Website";

        // [추가] Buy Me a Coffee 버튼 동적 생성 (혹시 HTML에 없다면 여기서 제어)
        // 기존 버튼 옆에 '후원하기' 버튼이 있는지 확인하거나, linkEl 부모에 추가
        const bmcButton = document.getElementById('bmc-btn-modal');
        if(bmcButton) {
            bmcButton.href = "https://buymeacoffee.com/tonycho"; // Tony님 주소
        }

        // [핵심] 봇이 생성한 이미지 순서대로 불러오기
        sliderEl.innerHTML = '';

        // 봇이 생성하는 파일명 리스트 (순서: PC메인 -> 모바일메인 -> PC서브 -> 모바일서브)
        const imagesToLoad = [
            { name: 'screenshot1.png', type: 'pc', label: 'Desktop View' },
            { name: 'screenshot_mobile1.png', type: 'mobile', label: 'Mobile View' },
            { name: 'screenshot2.png', type: 'pc', label: 'Detail View' },
            { name: 'screenshot_mobile2.png', type: 'mobile', label: 'Mobile Detail' }
        ];

        imagesToLoad.forEach(imgInfo => {
            const imgPath = `img/${project.folderName}/${imgInfo.name}`;
            
            const imgWrapper = document.createElement('div');
            imgWrapper.className = "mb-8 relative group"; // 그룹화

            const img = document.createElement('img');
            img.src = imgPath;
            
            // 스타일 분기: 모바일은 작게, PC는 넓게
            if (imgInfo.type === 'mobile') {
                img.className = "max-w-[280px] mx-auto rounded-[2rem] border-4 border-gray-800 shadow-2xl block"; // 아이폰 느낌
            } else {
                img.className = "w-full rounded-lg shadow-md border border-gray-200 block"; // PC 화면
            }

            // 이미지가 없으면(2번째 장이 없을 수도 있음) 숨김 처리
            img.onerror = function() { 
                imgWrapper.style.display = 'none'; 
            };

            // 라벨 추가 (선택사항)
            const label = document.createElement('p');
            label.className = "text-center text-gray-400 text-xs mt-2 uppercase tracking-widest font-semibold";
            label.innerText = imgInfo.label;

            imgWrapper.appendChild(img);
            imgWrapper.appendChild(label);
            sliderEl.appendChild(imgWrapper);
        });

        projectModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // 닫기 버튼들
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            projectModal.classList.add('hidden');
            contactModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    });

    // Contact 모달
    const openContactBtn = document.getElementById('open-contact');
    if(openContactBtn) {
        openContactBtn.addEventListener('click', () => {
            contactModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // 이메일 전송 폼 (mailto)
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.name.value;
            const email = contactForm.email.value;
            const message = contactForm.message.value;
            
            const subject = `[Portfolio Inquiry] Message from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            
            // Tony님의 실제 이메일로 변경
            window.location.href = `mailto:tonycho999@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            setTimeout(() => {
                contactModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
                contactForm.reset();
            }, 1000);
        });
    }
});
