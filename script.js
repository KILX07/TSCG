let currentLang = 'ko';
let currentPage = 'home';
let characters = [];
let translations = {};

// 1. 데이터 로드 함수 (상대 경로 수정)
async function initApp() {
    try {
        // 경로에서 ./ 를 제거하여 github pages 호환성 높임
        const charRes = await fetch('data/characters.json');
        const transRes = await fetch('data/translations.json');
        
        if (!charRes.ok || !transRes.ok) throw new Error("JSON 파일을 로드할 수 없습니다.");
        
        characters = await charRes.json();
        translations = await transRes.json();
        
        render(); 
    } catch (e) {
        document.getElementById('app-view').innerHTML = `
            <div style="text-align:center; padding:50px;">
                <h2 style="color:#ff4b2b;">Data Load Failed!</h2>
                <p style="color:#94a3b8; margin-top:10px;">${e.message}</p>
                <p style="margin-top:20px; font-size:12px;">폴더 구조가 data/characters.json 인지 확인하세요.</p>
            </div>`;
        console.error(e);
    }
}

// 2. 사이드바 제어
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('main-content').classList.toggle('pushed');
}

// 3. 언어 및 페이지 변경
function changeLang(lang) {
    currentLang = lang;
    render();
}

function navigateTo(page) {
    currentPage = page;
    render();
    // 모바일 닫기 로직
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('main-content').classList.remove('pushed');
    }
}

// 4. 화면 렌더링
function render() {
    const texts = translations[currentLang];
    if(!texts) return; // 번역 데이터 없으면 중단

    const app = document.getElementById('app-view');
    const menu = document.getElementById('nav-menu');

    // 메뉴 버튼 생성
    menu.innerHTML = `
        <div class="nav-item ${currentPage === 'home' ? 'active' : ''}" onclick="navigateTo('home')">${texts.nav_home}</div>
        <div class="nav-item ${currentPage === 'characters' ? 'active' : ''}" onclick="navigateTo('characters')">${texts.nav_chars}</div>
        <div class="nav-item ${currentPage === 'guide' ? 'active' : ''}" onclick="navigateTo('guide')">${texts.nav_guide}</div>
        <div class="nav-item ${currentPage === 'tierlist' ? 'active' : ''}" onclick="navigateTo('tierlist')">${texts.nav_tierlist}</div>
    `;

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    if(document.getElementById(`lang-${currentLang}`)) {
        document.getElementById(`lang-${currentLang}`).classList.add('active');
    }

    if (currentPage === 'home') {
        app.innerHTML = `
            <div style="text-align: center; padding-top: 20px;">
                <h1 style="font-family: 'Black Han Sans'; font-size: 4rem; color: #3b82f6;">${texts.home_welcome}</h1>
                <p style="font-size: 1.2rem; color: #64748b;">${texts.home_desc}</p>
                <div style="margin-top: 50px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; text-align: left;">
                    <div style="background: #161922; padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 style="color: #fff;">${texts.home_update_title}</h3>
                        <p style="color: #94a3b8; font-size: 0.9rem; margin-top:10px;">${texts.home_update_1}<br>${texts.home_update_2}</p>
                    </div>
                    <div style="background: #161922; padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                        <h3 style="color: #fff;">${texts.home_tip_title}</h3>
                        <p style="color: #94a3b8; font-size: 0.9rem; margin-top:10px;">${texts.home_tip_desc}</p>
                    </div>
                </div>
            </div>`;
    } 
    else if (currentPage === 'characters') {
        let html = `<h1 style="font-family: 'Black Han Sans'; font-size: 3rem; margin-bottom: 40px;">${texts.nav_chars}</h1>`;
        const positions = [{k:'WS', n:texts.ws}, {k:'SE', n:texts.se}, {k:'MB', n:texts.mb}];
        positions.forEach(pos => {
            html += `<div style="margin-bottom: 50px;">
                <h2 style="font-size: 1.5rem; color: #3b82f6; margin-bottom: 20px; border-bottom: 1px solid rgba(59, 130, 246, 0.2); padding-bottom: 10px;">${pos.n}</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 25px;">`;
            characters.filter(c => c.position === pos.k).forEach(char => {
                html += `<div class="char-card" style="width:100px;">
                    <div class="img-box" style="width:100px; height:125px; border-radius:15px;"><img src="images/${char.img}" onerror="this.src='https://via.placeholder.com/100x125'"></div>
                    <div style="margin-top:10px; font-size:13px; font-weight:bold;">${char.name[currentLang]}</div>
                </div>`;
            });
            html += `</div></div>`;
        });
        app.innerHTML = html;
    }
    else if (currentPage === 'guide') {
        app.innerHTML = `
            <h1 style="font-family: 'Black Han Sans'; font-size: 3rem; margin-bottom: 40px;">${texts.guide_title}</h1>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                <div style="background: #161922; padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                    <h3 style="color: #3b82f6; margin-bottom: 15px;">${texts.guide_role_title}</h3>
                    <p style="color: #94a3b8; font-size: 0.9rem; line-height:2.2;"><b>WS:</b> ${texts.guide_ws_desc}<br><b>SE:</b> ${texts.guide_se_desc}<br><b>MB:</b> ${texts.guide_mb_desc}</p>
                </div>
                <div style="background: #161922; padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05);">
                    <h3 style="color: #f9d423; margin-bottom: 15px;">${texts.guide_usage_title}</h3>
                    <p style="color: #94a3b8; font-size: 0.9rem; line-height:1.8;">${texts.guide_usage_desc}</p>
                </div>
            </div>`;
    }
    else if (currentPage === 'tierlist') {
        renderTierList(app, texts);
    }
}

function renderTierList(container, texts) {
    const tiers = ["S+", "S", "A+", "A"];
    const positions = ["WS", "SE", "MB"];
    
    let html = `<h1 style="text-align:center; font-family:'Black Han Sans'; font-size:3.5rem; margin-bottom:50px;">${texts.nav_tierlist}</h1>`;
    
    html += `<div class="table-wrapper">
                <table class="tier-table">
                    <thead>
                        <tr>
                            <th style="width:110px;">${texts.tier}</th>
                            <th>${texts.ws}(C0)</th>
                            <th>${texts.se}(C0)</th>
                            <th>${texts.mb}(C0)</th>
                        </tr>
                    </thead>
                    <tbody>`;

    // ... (이후 반복문 로직은 동일) ...

    tiers.forEach(t => {
        html += `<tr><td class="tier-label t-${t.replace('+', 'plus')}">${t}</td>`;
        positions.forEach(p => {
            html += `<td class="char-cell"><div class="char-grid">`;
            characters.filter(c => c.tier === t && c.position === p).forEach(char => {
                const gradeClass = char.grade.replace('+', 'plus').replace('-', 'minus');
                const tierClass = t.replace('+', 'plus');
                html += `<div class="char-card card-${tierClass}">
                            <div class="img-box">
                                <img src="images/${char.img}" onerror="this.src='https://via.placeholder.com/80x100'">
                                <div class="grade-tag grade-${gradeClass}">${char.grade}</div>
                            </div>
                            <div class="char-name">${char.name[currentLang]}</div>
                        </div>`;
            });
            html += `</div></td>`;
        });
        html += `</tr>`;
    });
    container.innerHTML = html + `</tbody></table></div>`;
}

// 초기 실행
initApp();



