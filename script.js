/* --- [The Spike Cross Guide 2.0 - Core JS] --- */

// State
const state = {
    lang: 'ko',
    route: 'home',
    characters: [],
    translations: {},
    searchTerm: '',
    filter: { pos: 'ALL', tier: 'ALL', grade: 'ALL' }
};

// Icons (SVG Data)
const icons = {
    home: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
    chars: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
    guide: '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>',
    tier: '<path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>',
    cafe: '<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H9v-2h6v2zm-3-7c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm0-6c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z"/>' // Abstract Coffee/Community icon
};

// --- [Init & Data] ---
async function init() {
    try {
        const [charRes, transRes] = await Promise.all([
            fetch('data/characters.json'),
            fetch('data/translations.json')
        ]);

        if (!charRes.ok || !transRes.ok) throw new Error("Data Load Failed");

        state.characters = await charRes.json();
        state.translations = await transRes.json();

        // Remove Loader
        setTimeout(() => {
            const loader = document.getElementById('page-loader');
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 800);

        renderNav();
        navigate(state.route); // Initial Route

    } catch (e) {
        console.error(e);
        document.body.innerHTML = `<div style="color:white; text-align:center; padding:50px;">Data Load Err: ${e.message}</div>`;
    }
}

// --- [Router] ---
function navigate(page) {
    state.route = page;
    renderApp();
    updateActiveNav();
    window.scrollTo(0, 0);
}

function updateActiveNav() {
    document.querySelectorAll('.nav-link, .mobile-link').forEach(el => {
        el.classList.toggle('active', el.dataset.page === state.route);
    });
}

// --- [Rendering] ---
function renderNav() {
    const t = getT();
    const pages = [
        { id: 'home', name: t.nav_home, icon: icons.home },
        { id: 'characters', name: t.nav_chars, icon: icons.chars },
        { id: 'guide', name: t.nav_guide, icon: icons.guide },
        { id: 'tierlist', name: t.nav_tierlist, icon: icons.tier }
    ];

    // Desktop
    const deskHtml = pages.map(p => `
        <button class="nav-link" data-page="${p.id}" onclick="navigate('${p.id}')">
            <svg class="nav-icon" viewBox="0 0 24 24">${p.icon}</svg>
            ${p.name}
        </button>
    `).join('');
    document.getElementById('desktop-nav').innerHTML = deskHtml;

    // Mobile
    const mobHtml = pages.map(p => `
        <button class="mobile-link" data-page="${p.id}" onclick="navigate('${p.id}')">
            <svg viewBox="0 0 24 24">${p.icon}</svg>
            <span>${p.name}</span>
        </button>
    `).join('');
    document.getElementById('mobile-nav').innerHTML = mobHtml;
}

function renderApp() {
    const container = document.getElementById('content-container');
    const t = getT();

    let html = '';

    switch (state.route) {
        case 'home': html = renderHome(t); break;
        case 'characters': html = renderCharacters(t); break;
        case 'guide': html = renderGuide(t); break;
        case 'tierlist': html = renderTierList(t); break;
        default: html = renderHome(t);
    }

    container.innerHTML = html;
}

// --- [Pages: Home (Bento)] ---
function renderHome(t) {
    return `
        <div style="margin-bottom: 30px;">
            <h1 style="font-size: 2.5rem; color: #fff; margin-bottom: 10px;">Hello, <span class="text-cyan">Player !</span></h1>
            <p style="color: var(--text-secondary);">Welcome to the TSCG guide.</p>
        </div>

        <div class="bento-grid">
            <!-- 1. Hero / Intro (Span 2) -->
            <div class="bento-item col-spanish-2 row-spanish-2" style="background: linear-gradient(135deg, rgba(0,243,255,0.1), rgba(188,19,254,0.1));">
                <div class="card-header">
                    <div class="card-title">Welcome</div>
                    <div style="font-size: 1.8rem; font-weight: 800; line-height: 1.4; color: #fff;">
                        THE SPIKE<br>CROSS GUIDE <span class="text-cyan">2.0</span>
                    </div>
                    <p class="card-desc" style="margin-top: 20px;">
                        ${t.home_desc || "Explore the ultimate strategy guide with a brand new experience."}
                    </p>
                </div>
                <div class="card-bg-icon" style="filter: blur(40px); background: var(--accent-cyan); width: 200px; height: 200px; opacity: 0.2;"></div>
            </div>

            <!-- 2. Cafe Link (Official Cafe) -->
            <a href="https://cafe.naver.com/thespike" target="_blank" class="bento-item flex-center" style="background: linear-gradient(to bottom right, #2DB400 0%, #1E7E00 100%); border:none; text-decoration: none;">
                <div style="text-align: center;">
                    <div style="background: rgba(0,0,0,0.2); width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px auto;">
                        <svg style="width: 24px; height: 24px; fill: #fff;" viewBox="0 0 24 24">${icons.cafe}</svg> 
                    </div>
                    <div style="font-size: 1.1rem; font-weight: 800; color: #fff; line-height: 1.2;">OFFICIAL<br>CAFE</div>
                    <div style="font-size: 0.75rem; color: rgba(255,255,255,0.9); margin-top: 8px; background: rgba(0,0,0,0.2); padding: 4px 10px; border-radius: 20px;">Join Community ↗</div>
                </div>
            </a>

            <!-- 3. Tier Check Shortcut -->
            <div class="bento-item" onclick="navigate('tierlist')" style="cursor: pointer;">
                <div class="card-header">
                    <div class="card-title">TIER LIST</div>
                    <div class="card-value text-purple">S+ RANK</div>
                    <p class="card-desc">Check the meta</p>
                </div>
                <div class="card-bg-icon">
                    <svg viewBox="0 0 24 24" fill="#a855f7">${icons.tier}</svg>
                </div>
            </div>

            <!-- 4. Notices -->
            <div class="bento-item col-spanish-2">
                <div class="card-header">
                    <div class="card-title">📢 NOTICES</div>
                    <ul style="list-style: none; margin-top: 15px;">
                        <li style="margin-bottom: 10px; color: #ddd; font-size: 0.95rem; display: flex; gap: 10px;">
                            <span class="text-cyan">•</span> ${t.home_update_1 || "Latest Update"}
                        </li>
                        <li style="color: var(--text-secondary); font-size: 0.95rem; display: flex; gap: 10px;">
                            <span class="text-secondary">•</span> ${t.home_update_2 || "System Check"}
                        </li>
                    </ul>
                </div>
            </div>

             <!-- 5. Tips -->
            <div class="bento-item col-spanish-2">
                <div class="card-header">
                    <div class="card-title">💡 TIPS</div>
                     <p class="card-desc" style="color: #fff; line-height: 1.6;">
                        ${t.home_tip_desc || "Tip provided here."}
                     </p>
                </div>
            </div>
        </div>

        <footer style="margin-top: 60px; text-align: center; color: var(--text-dim); font-size: 0.8rem; padding-bottom: 40px;">
            <p style="margin-bottom: 8px;">Copyright © 2026 The Spike Cross Guide</p>
            <p>This site is unofficial and is not affiliated with Suncyan.</p>
        </footer>
    `;
}

// --- [Pages: Characters] ---
// --- [Pages: Characters] ---
function renderCharacters(t) {
    // Filter Logic
    let filtered = state.characters.filter(c => {
        const matchesSearch = c.name[state.lang].toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesPos = state.filter.pos === 'ALL' || c.position === state.filter.pos;
        // Use Grade for filtering in Characters tab
        const matchesGrade = state.filter.grade === 'ALL' || c.grade === state.filter.grade;
        return matchesSearch && matchesPos && matchesGrade;
    });

    // Get unique grades for the filter dropdown
    const uniqueGrades = [...new Set(state.characters.map(c => c.grade))].sort();
    // Custom sort might be needed (S+, S, S-, A+...) but lexicographical might be okay for now or we hardcode specific priority.
    // Let's hardcode the order for better UX: S+, S, S-, A+, A...
    const gradeOrder = ['S+', 'S', 'S-', 'A+', 'A', 'B', 'C'];
    uniqueGrades.sort((a, b) => {
        const idxA = gradeOrder.indexOf(a);
        const idxB = gradeOrder.indexOf(b);
        if (idxA === -1 && idxB === -1) return a.localeCompare(b);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
    });

    return `
        <div class="utility-dock">
            <input type="text" class="search-input" placeholder="${t.search_placeholder || 'Search...'}" 
                value="${state.searchTerm}" 
                oninput="handleSearch(this.value)">
            
            <select class="filter-select" onchange="handleFilter('pos', this.value)">
                <option value="ALL">All Pos</option>
                <option value="WS" ${state.filter.pos === 'WS' ? 'selected' : ''}>WS</option>
                <option value="SE" ${state.filter.pos === 'SE' ? 'selected' : ''}>SE</option>
                <option value="MB" ${state.filter.pos === 'MB' ? 'selected' : ''}>MB</option>
            </select>
            
            <select class="filter-select" onchange="handleFilter('grade', this.value)">
                <option value="ALL">All Grades</option>
                ${uniqueGrades.map(g => `<option value="${g}" ${state.filter.grade === g ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
        </div>

        <div id="char-grid-container" class="char-grid-2">
            ${renderCharacterGridItems(filtered)}
        </div>
    `;
}

function renderCharacterGridItems(list) {
    if (!list.length) return `<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim);">No results found.</div>`;

    return list.map(c => `
        <div class="char-card-2" onclick="openModal('${c.id}')" style="box-shadow: 0 0 15px ${getGradeColor(c.grade)}44; border-color: ${getGradeColor(c.grade)}aa;">
            <img src="images/${c.img}" onerror="this.src='https://via.placeholder.com/150'">
            <div class="char-overlay"></div>
            <div class="char-info">
                <div class="char-name-2" style="text-shadow: 0 0 5px ${getGradeColor(c.grade)};">${c.name[state.lang]}</div>
                <div style="font-size: 0.7rem; color: ${getGradeColor(c.grade)}; font-weight: bold; text-shadow: 0 0 5px ${getGradeColor(c.grade)}66;">${c.grade}</div>
            </div>
        </div>
    `).join('');
}

// --- [Pages: Guide] ---
let activeGuideId = null;


function renderGuide(t) {
    const chars = state.characters;

    // Filter Logic (Same as Characters Tab)
    let filtered = chars.filter(c => {
        const matchesSearch = c.name[state.lang].toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesPos = state.filter.pos === 'ALL' || c.position === state.filter.pos;
        const matchesGrade = state.filter.grade === 'ALL' || c.grade === state.filter.grade;
        return matchesSearch && matchesPos && matchesGrade;
    });

    if (!activeGuideId && filtered.length > 0) activeGuideId = filtered[0].id;

    // Fallback if activeGuideId is filtered out
    if (filtered.length > 0 && !filtered.find(c => c.id === activeGuideId)) {
        activeGuideId = filtered[0].id;
    }

    const activeChar = chars.find(c => c.id === activeGuideId) || (filtered.length > 0 ? filtered[0] : null);
    const guide = activeChar ? (activeChar.guide || {}) : {};

    // Get unique grades for filter
    const uniqueGrades = [...new Set(chars.map(c => c.grade))].sort();
    const gradeOrder = ['S+', 'S', 'S-', 'A+', 'A', 'B', 'C'];
    uniqueGrades.sort((a, b) => {
        const idxA = gradeOrder.indexOf(a); const idxB = gradeOrder.indexOf(b);
        if (idxA === -1 && idxB === -1) return a.localeCompare(b);
        if (idxA === -1) return 1; if (idxB === -1) return -1;
        return idxA - idxB;
    });

    return `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Top: Search & Filter -->
            <div class="utility-dock">
                <input type="text" class="search-input" placeholder="${t.search_placeholder || 'Search...'}" 
                    value="${state.searchTerm}" 
                    oninput="handleSearch(this.value)">
                <select class="filter-select" onchange="handleFilter('pos', this.value)">
                    <option value="ALL">All Pos</option>
                    <option value="WS" ${state.filter.pos === 'WS' ? 'selected' : ''}>WS</option>
                    <option value="SE" ${state.filter.pos === 'SE' ? 'selected' : ''}>SE</option>
                    <option value="MB" ${state.filter.pos === 'MB' ? 'selected' : ''}>MB</option>
                </select>
                <select class="filter-select" onchange="handleFilter('grade', this.value)">
                    <option value="ALL">All Grades</option>
                    ${uniqueGrades.map(g => `<option value="${g}" ${state.filter.grade === g ? 'selected' : ''}>${g}</option>`).join('')}
                </select>
            </div>

            <!-- Middle: Horizontal Character List -->
            <div id="guide-list-container" style="display: flex; flex-direction: row; gap: 15px; overflow-x: auto; padding: 10px 5px; flex-wrap: nowrap;">
                ${renderGuideListItems(filtered)}
            </div>

            <!-- Bottom: Character Details Viewer -->
            <div class="guide-viewer" style="flex: 1;">
                ${activeChar ? `
                    <div class="guide-detail-header">
                        <img class="guide-detail-img" src="images/${activeChar.img}" onerror="this.src='https://via.placeholder.com/150'" style="border-color: ${getGradeColor(activeChar.grade)}; box-shadow: 0 0 20px ${getGradeColor(activeChar.grade)}44;">
                        <div>
                            <h1 style="font-size: 2.5rem; margin-bottom: 5px; font-weight: 300; text-shadow: 0 0 10px ${getGradeColor(activeChar.grade)}66;">${activeChar.name[state.lang]}</h1>
                            <div style="display: flex; gap: 10px;">
                                <span style="background: ${getGradeColor(activeChar.grade)}; color: #000; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 900;">${activeChar.grade}</span>
                                <span style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${activeChar.position}</span>
                            </div>
                        </div>
                    </div>

                    ${guide.stats ? `
                        <div class="stat-grid">
                            <div class="stat-box">
                                <div class="stat-label" style="color: ${getGradeColor(activeChar.grade)}">📊 ${t.guide_stats}</div>
                                <p style="font-size: 0.9rem; line-height: 1.6;">${guide.stats[state.lang] || guide.stats}</p>
                            </div>
                            <div class="stat-box">
                                <div class="stat-label" style="color: ${getGradeColor(activeChar.grade)}">🤝 ${t.guide_party}</div>
                                <div style="display: flex; gap: 10px; margin-top: 10px;">
                                    ${guide.party ? guide.party.map(pid => {
        const p = chars.find(ch => ch.id === pid);
        return p ? `<img src="images/${p.img}" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2);" title="${p.name[state.lang]}">` : '';
    }).join('') : '-'}
                                </div>
                            </div>
                            <div class="stat-box col-spanish-2">
                                <div class="stat-label" style="color: ${getGradeColor(activeChar.grade)}">⚡ ${t.guide_breakthrough}</div>
                                <p style="font-size: 0.9rem; color: var(--text-secondary);">${guide.breakthrough ? (guide.breakthrough[state.lang] || guide.breakthrough) : '-'}</p>
                            </div>
                        </div>
                    ` : `
                        <div style="text-align: center; padding: 50px; color: var(--text-dim);">
                            <div style="font-size: 3rem; margin-bottom: 20px;">🔍</div>
                            가이드 준비 중 입니다
                        </div>
                    `}
                ` : `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-dim);">
                        <div style="font-size: 3rem; margin-bottom: 20px;">🚫</div>
                        <div>No character selected</div>
                    </div>
                `}
            </div>
        </div>
    `;
}

function renderTierList(t) {
    const tiers = ['S+', 'S', 'A+', 'A', 'B', 'C']; // Define Tier Order
    const grouped = {};

    // Filter by Position
    const filteredChars = state.characters.filter(c => {
        return state.filter.pos === 'ALL' || c.position === state.filter.pos;
    });

    // Group by Tier
    filteredChars.forEach(c => {
        if (!grouped[c.tier]) grouped[c.tier] = [];
        grouped[c.tier].push(c);
    });

    return `
        <div style="padding-bottom: 50px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                <div>
                    <h1 style="font-size: 2rem; margin-bottom: 5px;">Tier List</h1>
                    <p style="color: var(--text-secondary);">Current Meta Rankings</p>
                </div>
                <select class="filter-select" onchange="handleFilter('pos', this.value)">
                    <option value="ALL">All Pos</option>
                    <option value="WS" ${state.filter.pos === 'WS' ? 'selected' : ''}>WS</option>
                    <option value="SE" ${state.filter.pos === 'SE' ? 'selected' : ''}>SE</option>
                    <option value="MB" ${state.filter.pos === 'MB' ? 'selected' : ''}>MB</option>
                </select>
            </div>

            <div class="tier-container">
                ${tiers.map(tier => {
        const chars = grouped[tier] || [];
        if (chars.length === 0) return '';

        // Assign colors for tiers
        let color = '#444';
        if (tier === 'S+') color = '#ff4d4d'; // Red
        else if (tier === 'S') color = '#ff9f43'; // Orange
        else if (tier === 'A+') color = '#feca57'; // Yellow
        else if (tier === 'A') color = '#54a0ff'; // Blue
        else color = '#badc58'; // Green/Other

        return `
                        <div class="tier-row" style="display: flex; margin-bottom: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden;">
                            <div class="tier-label" style="
                                width: 80px; 
                                flex-shrink: 0;
                                background: ${color}; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                font-size: 1.5rem; 
                                font-weight: 900; 
                                color: #1e1e1e;
                                text-shadow: 0 1px 0 rgba(255,255,255,0.3);
                            ">
                                ${tier}
                            </div>
                            <div class="tier-chars" style="padding: 10px; display: flex; flex-wrap: wrap; gap: 10px;">
                                ${chars.map(c => `
                                    <div class="tier-char-card" onclick="openModal('${c.id}')" style="width: 60px; text-align: center; cursor: pointer;">
                                        <img src="images/${c.img}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; background: #333;" onerror="this.src='https://via.placeholder.com/50'">
                                        <div style="font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 4px;">${c.name[state.lang]}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div >
        `;
}

// Actions
function handleSearch(val) {
    state.searchTerm = val;
    updateViewOnly();
}
function handleFilter(k, v) {
    state.filter[k] = v;
    updateViewOnly();
}

function updateViewOnly() {
    // If we are in Characters tab
    const charGrid = document.getElementById('char-grid-container');
    if (charGrid && state.route === 'characters') {
        const filtered = getFilteredCharacters();
        charGrid.innerHTML = renderCharacterGridItems(filtered);
        return;
    }

    // If we are in Guide tab
    const guideList = document.getElementById('guide-list-container');
    if (guideList && state.route === 'guide') {
        const filtered = getFilteredCharacters();
        guideList.innerHTML = renderGuideListItems(filtered);
        return;
    }

    // Fallback
    renderApp();
}

function getFilteredCharacters() {
    return state.characters.filter(c => {
        const matchesSearch = c.name[state.lang].toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesPos = state.filter.pos === 'ALL' || c.position === state.filter.pos;
        const matchesGrade = state.filter.grade === 'ALL' || c.grade === state.filter.grade;
        return matchesSearch && matchesPos && matchesGrade;
    });
}

function selectGuide(id) {
    // Save scroll position before re-render
    const listContainer = document.getElementById('guide-list-container');
    const scrollLeft = listContainer ? listContainer.scrollLeft : 0;

    activeGuideId = id;
    renderApp();

    // Restore scroll position after re-render
    requestAnimationFrame(() => {
        const newListContainer = document.getElementById('guide-list-container');
        if (newListContainer) {
            newListContainer.scrollLeft = scrollLeft;
        }
    });
}
function openModal(id) {
    // Navigate to Guide tab with selected character
    activeGuideId = id;
    navigate('guide');
}
function renderGuideListItems(list) {
    if (!list.length) return `<div style="padding: 20px; text-align: center; color: var(--text-dim); white-space: nowrap;">No results</div>`;

    return list.map(c => `
        <div class="guide-item ${c.id === activeGuideId ? 'active' : ''}" onclick="selectGuide('${c.id}')" style="min-width: 140px; flex-shrink: 0; background: var(--bg-card); ${c.id === activeGuideId ? `border: 2px solid ${getGradeColor(c.grade)}; box-shadow: 0 0 15px ${getGradeColor(c.grade)}44;` : 'border: 1px solid var(--border-light);'}">
            <img src="images/${c.img}" onerror="this.src='https://via.placeholder.com/40'" style="${c.id === activeGuideId ? `box-shadow: 0 0 10px ${getGradeColor(c.grade)}66;` : ''}">
            <div class="guide-item-info">
                <span class="guide-item-name" style="${c.id === activeGuideId ? `color: ${getGradeColor(c.grade)};` : ''}">${c.name[state.lang]}</span>
                <span class="guide-item-sub">${c.position} / ${c.grade}</span>
            </div>
        </div>
    `).join('');
}

// Utils
function getT() { return state.translations[state.lang] || state.translations['en']; }
function getGradeColor(grade) {
    // Basic Normalization
    const g = (grade || '').toUpperCase();
    if (g.includes('S+')) return '#ff3b3b'; // Red
    if (g === 'S') return '#ffbd2e'; // Yellow
    if (g.includes('S-')) return '#fff9c4'; // Pale Yellow (Light)
    if (g.includes('A')) return '#64ff64'; // Light Green
    return '#a0a0b0'; // Default Grey
}

// Start
init();
