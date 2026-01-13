let currentLang = 'ko';
let currentPage = 'home';
let characters = [];
let translations = {};

// 1. 초기 로드
async function initApp() {
    try {
        const charRes = await fetch('data/characters.json');
        const transRes = await fetch('data/translations.json');
        characters = await charRes.json();
        translations = await transRes.json();
        render(); 
    } catch (e) {
        document.getElementById('app-view').innerHTML = `<h2 style="text-align:center; color:#ff4b2b; margin-top:50px;">Data Load Failed</h2>`;
    }
}

// 2. 사이드바 토글 (오버레이 관리)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('main-content');
    sidebar.classList.toggle('active');
    
    // PC에서만 본문 밀기
    if (window.innerWidth > 768) {
        content.classList.toggle('pushed');
    }
    document.body.classList.toggle('menu-open');
}

// 3. 페이지 이동 (즉시 닫기 로직 포함)
function navigateTo(page) {
    currentPage = page;
    render();
    
    // 메뉴가 열려있다면(menu-open 클래스가 있다면) 무조건 닫기
    if (document.body.classList.contains('menu-open')) {
        toggleSidebar();
    }
}

function changeLang(lang) {
    currentLang = lang;
    render();
}

// 4. 화면 그리기
function render() {
    const texts = translations[currentLang];
    if(!texts) return;

    const app = document.getElementById('app-view');
    const menu = document.getElementById('nav-menu');
    const indicator = document.getElementById('nav-indicator');

    // 메뉴 아이템 생성
    menu.innerHTML = `
        <div class="nav-item ${currentPage === 'home' ? 'active' : ''}" onclick="navigateTo('home')">${texts.nav_home}</div>
        <div class="nav-item ${currentPage === 'characters' ? 'active' : ''}" onclick="navigateTo('characters')">${texts.nav_chars}</div>
        <div class="nav-item ${currentPage === 'guide' ? 'active' : ''}" onclick="navigateTo('guide')">${texts.nav_guide}</div>
        <div class="nav-item ${currentPage === 'tierlist' ? 'active' : ''}" onclick="navigateTo('tierlist')">${texts.nav_tierlist}</div>
    `;

    // 파란 박스 이동 애니메이션
    setTimeout(() => {
        const activeItem = menu.querySelector('.active');
        if (activeItem && indicator) {
            indicator.style.display = 'block';
            indicator.style.top = activeItem.offsetTop + 'px';
        }
    }, 100);

    // 본문 내용 (생략 - 기존 로직 유지)
    if (currentPage === 'home') renderHome(app, texts);
    else if (currentPage === 'tierlist') renderTierList(app, texts);
    else if (currentPage === 'characters') renderCharacters(app, texts);
    else if (currentPage === 'guide') renderGuide(app, texts);
}

// --- [렌더링 서브 함수들 - 생략 방지용 통합] ---
function renderHome(container, texts) {
    container.innerHTML = `<div style="text-align:center;"><h1 style="font-family:'Black Han Sans'; font-size:4rem; color:#3b82f6; margin-bottom:20px;">${texts.home_welcome}</h1><p style="color:#64748b; font-size:1.2rem;">${texts.home_desc}</p></div>`;
}

function renderTierList(container, texts) {
    const tiers = ["S+", "S", "A+", "A"];
    const positions = ["WS", "SE", "MB"];
    let html = `<h1 style="text-align:center; font-family:'Black Han Sans'; font-size:3.5rem; margin-bottom:50px;">${texts.nav_tierlist}</h1>
                <div class="table-wrapper"><table class="tier-table"><thead><tr>
                <th style="width:120px;">${texts.tier}</th><th style="width:310px;">${texts.ws}</th><th style="width:310px;">${texts.se}</th><th style="width:310px;">${texts.mb}</th>
                </tr></thead><tbody>`;
    tiers.forEach(t => {
        html += `<tr><td class="tier-label t-${t.replace('+', 'plus')}">${t}</td>`;
        positions.forEach(p => {
            html += `<td class="char-cell"><div class="char-grid">`;
            characters.filter(c => c.tier === t && c.position === p).forEach(char => {
                const gradeClass = char.grade.replace('+', 'plus').replace('-', 'minus');
                html += `<div class="char-card card-${t.replace('+', 'plus')}">
                            <div class="img-box"><img src="images/${char.img}" onerror="this.src='https://via.placeholder.com/80x100'">
                            <div class="grade-tag grade-${gradeClass}">${char.grade}</div></div>
                            <div class="char-name">${char.name[currentLang]}</div>
                        </div>`;
            });
            html += `</div></td>`;
        });
        html += `</tr>`;
    });
    container.innerHTML = html + `</tbody></table></div>`;
}

// 캐릭터/가이드 렌더 함수 추가... (기존 소스코드와 동일하게 유지)

initApp();
