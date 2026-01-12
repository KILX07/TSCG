let currentLang = 'ko';
let currentPage = 'home';
let characters = [];
let translations = {};

async function initApp() {
    try {
        const charRes = await fetch('data/characters.json');
        const transRes = await fetch('data/translations.json');
        characters = await charRes.json();
        translations = await transRes.json();
        render(); 
    } catch (e) {
        console.error("Data load failed", e);
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('main-content').classList.toggle('pushed');
}

function changeLang(lang) {
    currentLang = lang;
    render();
}

function navigateTo(page) {
    currentPage = page;
    render();
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('main-content').classList.remove('pushed');
    }
}

function render() {
    const texts = translations[currentLang];
    const app = document.getElementById('app-view');
    const menu = document.getElementById('nav-menu');

    menu.innerHTML = `
        <div class="nav-item ${currentPage === 'home' ? 'active' : ''}" onclick="navigateTo('home')">${texts.nav_home}</div>
        <div class="nav-item ${currentPage === 'characters' ? 'active' : ''}" onclick="navigateTo('characters')">${texts.nav_chars}</div>
        <div class="nav-item ${currentPage === 'guide' ? 'active' : ''}" onclick="navigateTo('guide')">${texts.nav_guide}</div>
        <div class="nav-item ${currentPage === 'tierlist' ? 'active' : ''}" onclick="navigateTo('tierlist')">${texts.nav_tierlist}</div>
    `;

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${currentLang}`).classList.add('active');

    if (currentPage === 'home') {
        app.innerHTML = `
            <div style="text-align: center;">
                <h1 style="font-family: 'Black Han Sans'; font-size: 4rem; color: #3b82f6; margin-bottom:20px;">${texts.home_welcome}</h1>
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
    else if (currentPage === 'tierlist') {
        renderTierList(app, texts);
    }
    // 캐릭터 및 가이드 탭 생략 (기존 로직 유지)
}

function renderTierList(container, texts) {
    const tiers = ["S+", "S", "A+", "A"];
    const positions = ["WS", "SE", "MB"];
    let html = `<h1 style="font-family: 'Black Han Sans'; font-size: 3.5rem; margin-bottom: 40px; text-align: center;">${texts.nav_tierlist}</h1>
                <div class="table-wrapper">
                <table class="tier-table"><thead><tr>
                <th style="width:110px;">${texts.tier}</th><th>${texts.ws}(C0)</th><th>${texts.se}(C0)</th><th>${texts.mb}(C0)</th>
                </tr></thead><tbody>`;
    
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

initApp();
