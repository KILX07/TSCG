let currentLang = 'ko';
let currentPage = 'home';
let characters = [];
let translations = {};

// 1. 초기 데이터 로드
async function initApp() {
    try {
        const charRes = await fetch('data/characters.json');
        const transRes = await fetch('data/translations.json');
        if (!charRes.ok || !transRes.ok) throw new Error("JSON load failed");
        characters = await charRes.json();
        translations = await transRes.json();
        render(); 
    } catch (e) {
        document.getElementById('app-view').innerHTML = `<h2 style="text-align:center; color:#ff4b2b; margin-top:50px;">Data Load Failed</h2>`;
    }
}

// 2. 사이드바 토글 (오버레이 로직 포함)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('main-content');
    
    sidebar.classList.toggle('active');
    
    // PC에서 사이드바가 열릴 때 본문을 밀어줌
    if (window.innerWidth > 768) {
        content.classList.toggle('pushed');
    }
    
    // 바디에 클래스를 추가하여 오버레이(배경 블러) 처리
    document.body.classList.toggle('menu-open');
}

// 3. 언어 변경
function changeLang(lang) {
    currentLang = lang;
    render();
}

// 4. 페이지 이동 (즉시 닫기 로직 핵심)
function navigateTo(page) {
    currentPage = page;
    render();
    
    // ⭐ 메뉴가 열려있는 상태에서 탭을 선택하면 즉시 닫기
    if (document.body.classList.contains('menu-open')) {
        toggleSidebar();
    }
}

// 5. 화면 렌더링 핵심 로직
function render() {
    const texts = translations[currentLang];
    if(!texts) return;

    const app = document.getElementById('app-view');
    const menu = document.getElementById('nav-menu');
    const indicator = document.getElementById('nav-indicator');

    // 메뉴 버튼 생성
    menu.innerHTML = `
        <div class="nav-item ${currentPage === 'home' ? 'active' : ''}" onclick="navigateTo('home')">${texts.nav_home}</div>
        <div class="nav-item ${currentPage === 'characters' ? 'active' : ''}" onclick="navigateTo('characters')">${texts.nav_chars}</div>
        <div class="nav-item ${currentPage === 'guide' ? 'active' : ''}" onclick="navigateTo('guide')">${texts.nav_guide}</div>
        <div class="nav-item ${currentPage === 'tierlist' ? 'active' : ''}" onclick="navigateTo('tierlist')">${texts.nav_tierlist}</div>
    `;

    // ⭐ 파란색 인디케이터(박스) 부드러운 이동 애니메이션
    setTimeout(() => {
        const activeItem = menu.querySelector('.active');
        if (activeItem && indicator) {
            indicator.style.display = 'block';
            // 파란 박스를 선택된 글자 위치로 미끄러지게 함
            indicator.style.top = activeItem.offsetTop + 'px';
        }
    }, 100);

    // 언어 버튼 강조 업데이트
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    if(document.getElementById(`lang-${currentLang}`)) {
        document.getElementById(`lang-${currentLang}`).classList.add('active');
    }

    // 페이지별 본문 그리기 로직 (home, tierlist 등)
    if (currentPage === 'home') renderHome(app, texts);
    else if (currentPage === 'tierlist') renderTierList(app, texts);
    else if (currentPage === 'characters') renderCharacters(app, texts);
    else if (currentPage === 'guide') renderGuide(app, texts);
}

// --- [렌더링 보조 함수들] ---

function renderHome(container, texts) {
    container.innerHTML = `
        <div style="text-align: center;">
            <h1 style="font-family: 'Black Han Sans'; font-size: 4rem; color: #3b82f6; margin-bottom:20px;">${texts.home_welcome}</h1>
            <p style="font-size: 1.2rem; color: #64748b;">${texts.home_desc}</p>
            <div style="margin-top: 50px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; text-align: left;">
                <div style="background: #161922; padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                    <h3 style="color: #fff;">${texts.home_update_title}</h3>
                    <p style="color: #94a3b8; font-size: 0.85rem; margin-top:10px;">${texts.home_update_1}<br>${texts.home_update_2}</p>
                </div>
                <div style="background: #161922; padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                    <h3 style="color: #fff;">${texts.home_tip_title}</h3>
                    <p style="color: #94a3b8; font-size: 0.85rem; margin-top:10px;">${texts.home_tip_desc}</p>
                </div>
            </div>
        </div>`;
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
                const tierClass = t.replace('+', 'plus');
                html += `<div class="char-card card-${tierClass}">
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

function renderCharacters(container, texts) {
    let html = `<h1 style="font-family:'Black Han Sans'; font-size:3rem; margin-bottom:40px; text-align:center;">${texts.nav_chars}</h1>`;
    const posList = [{k:'WS', n:texts.ws}, {k:'SE', n:texts.se}, {k:'MB', n:texts.mb}];
    posList.forEach(pos => {
        html += `<div style="margin-bottom: 50px; width:100%; max-width:1000px; margin:auto;">
                    <h2 style="font-size:1.5rem; color:#3b82f6; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px; margin-bottom:20px;">${pos.n}</h2>
                    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:20px;">`;
        characters.filter(c => c.position === pos.k).forEach(char => {
            html += `<div class="char-card" style="width:100px;"><div class="img-box" style="width:100px; height:125px; border-radius:15px;"><img src="images/${char.img}" style="width:100%; height:100%; object-fit:cover;"></div>
                    <div style="margin-top:10px; font-size:13px; font-weight:bold; color:#fff; text-align:center;">${char.name[currentLang]}</div></div>`;
        });
        html += `</div></div>`;
    });
    container.innerHTML = html;
}

function renderGuide(container, texts) {
    container.innerHTML = `<h1 style="font-family:'Black Han Sans'; font-size:3rem; margin-bottom:40px; text-align:center;">${texts.guide_title}</h1>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:30px; max-width:1000px; margin:auto;">
            <div style="background:#161922; padding:30px; border-radius:20px; border:1px solid rgba(255,255,255,0.05);"><h3 style="color:#3b82f6; margin-bottom:15px;">${texts.guide_role_title}</h3><p style="color:#94a3b8; line-height:2.2;"><b>WS:</b> ${texts.guide_ws_desc}<br><b>SE:</b> ${texts.guide_se_desc}<br><b>MB:</b> ${texts.guide_mb_desc}</p></div>
            <div style="background:#161922; padding:30px; border-radius:20px; border:1px solid rgba(255,255,255,0.05);"><h3 style="color:#f9d423; margin-bottom:15px;">${texts.guide_usage_title}</h3><p style="color:#94a3b8; line-height:1.8;">${texts.guide_usage_desc}</p></div>
        </div>`;
}

initApp();
