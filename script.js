const SAVE_KEY = 'clih-save';
const PIXEL_W = 320, PIXEL_H = 150;
const SKYLINE_Y = 100;
const GROUND_Y = 128;

// Building types (passive income, scaling price)
const buildings = [
    { name: 'House',      baseCost: 15,           costMult: 1.15, income: 0.1 },
    { name: 'Shop',       baseCost: 100,          costMult: 1.15, income: 1   },
    { name: 'Apartment',  baseCost: 1100,         costMult: 1.15, income: 8   },
    { name: 'Office',     baseCost: 12000,        costMult: 1.15, income: 47  },
    { name: 'Skyscraper', baseCost: 130000,       costMult: 1.15, income: 260 },
    { name: 'Warehouse',  baseCost: 1500000,      costMult: 1.15, income: 1400 },
    { name: 'Mall',       baseCost: 17000000,     costMult: 1.15, income: 7800 },
    { name: 'Stadium',    baseCost: 200000000,    costMult: 1.15, income: 44000 },
    { name: 'Airport',    baseCost: 2300000000,   costMult: 1.15, income: 260000 },
    { name: 'Spaceport',  baseCost: 26000000000,  costMult: 1.15, income: 1500000 }
];

const BUILDING_STYLES = [
    { w: 14, h: 16, body: '#8b3a3a', dark: '#5e2323', layer: 0, kind: 'brick' }, // House
    { w: 18, h: 20, body: '#7a4a2a', dark: '#4e2d18', layer: 0, kind: 'brick' }, // Shop
    { w: 16, h: 28, body: '#b07840', dark: '#7a4d22', layer: 1, kind: 'brick' }, // Apartment
    { w: 20, h: 34, body: '#6b6f76', dark: '#464a50', layer: 2, kind: 'brick' }, // Office
    { w: 22, h: 44, body: '#4d5a6b', dark: '#303b49', layer: 2, kind: 'brick' }, // Skyscraper
    { w: 26, h: 20, body: '#8a6d4b', dark: '#5c4730', layer: 0, kind: 'warehouse' }, // Warehouse
    { w: 28, h: 30, body: '#5b8a72', dark: '#3a5c4a', layer: 1, kind: 'mall' }, // Mall
    { w: 30, h: 24, body: '#9aa0a8', dark: '#6a7078', layer: 1, kind: 'dome' }, // Stadium
    { w: 28, h: 38, body: '#8a93a0', dark: '#5c6470', layer: 2, kind: 'tower' }, // Airport
    { w: 30, h: 48, body: '#7d6ba8', dark: '#524378', layer: 2, kind: 'tower' }  // Spaceport
];

// Depth bands drawn back-to-front. Taller buildings live further back,
// sit higher on the ground plane, and scroll slower (parallax).
const LAYERS = [
    { speed: 1.00, groundOffset: 0 }, // front: houses, shops
    { speed: 0.78, groundOffset: 4 }, // middle: apartments
    { speed: 0.60, groundOffset: 9 }  // back: offices, skyscrapers
];

let state = {
    money: 0,
    clickPower: 1,
    clickLevel: 0,
    buildings: buildings.map(() => 0),
    totalClicks: 0,
    totalEarned: 0,
    achievements: [],
    balloonsCaught: 0,
    prestige: 0,
    bestCombo: 0,
    lastSaved: 0
};

// Building milestones: doubling that building type's income at these ownership counts
const MILESTONES = [25, 50, 100, 200];
// Prestige: reset your run for permanent +10% income per point
const PRESTIGE_DIVISOR = 1e6;
// Click combo: clicking within the window builds a temporary click multiplier
const COMBO_WINDOW = 2500;
const COMBO_CAP = 30;

const ACHIEVEMENTS = [
    { id: 'first_click', name: 'First Flight', desc: 'Click the plane once', check: s => s.totalClicks >= 1 },
    { id: 'click_100', name: 'Committed Clicker', desc: 'Click the plane 100 times', check: s => s.totalClicks >= 100 },
    { id: 'click_1000', name: 'Click Maniac', desc: 'Click the plane 1,000 times', check: s => s.totalClicks >= 1000 },
    { id: 'first_building', name: 'Ground Breaking', desc: 'Own your first building', check: s => s.buildings.reduce((a, b) => a + b, 0) >= 1 },
    { id: 'buildings_50', name: 'City Planner', desc: 'Own 50 buildings', check: s => s.buildings.reduce((a, b) => a + b, 0) >= 50 },
    { id: 'buildings_200', name: 'Tycoon', desc: 'Own 200 buildings', check: s => s.buildings.reduce((a, b) => a + b, 0) >= 200 },
    { id: 'earn_1000', name: 'Big Spender', desc: 'Earn $1,000 total', check: s => s.totalEarned >= 1000 },
    { id: 'earn_1m', name: 'Millionaire', desc: 'Earn $1,000,000 total', check: s => s.totalEarned >= 1000000 },
    { id: 'earn_1b', name: 'Billionaire', desc: 'Earn $1,000,000,000 total', check: s => s.totalEarned >= 1e9 },
    { id: 'click_10000', name: 'Autopilot', desc: 'Click the plane 10,000 times', check: s => s.totalClicks >= 10000 },
    { id: 'buildings_500', name: 'Metropolis', desc: 'Own 500 buildings', check: s => s.buildings.reduce((a, b) => a + b, 0) >= 500 },
    { id: 'buildings_1000', name: 'Mega City', desc: 'Own 1,000 buildings', check: s => s.buildings.reduce((a, b) => a + b, 0) >= 1000 },
    { id: 'balloon', name: 'Up, Up & Away', desc: 'Catch a hot air balloon', check: s => s.balloonsCaught >= 1 },
    { id: 'warehouse_25', name: 'Logistics Lord', desc: 'Own 25 warehouses', check: s => s.buildings[5] >= 25 },
    { id: 'mall_10', name: 'Retail King', desc: 'Own 10 malls', check: s => s.buildings[6] >= 10 },
    { id: 'stadium_5', name: 'Home Field Advantage', desc: 'Own 5 stadiums', check: s => s.buildings[7] >= 5 },
    { id: 'airport_1', name: 'Clear for Takeoff', desc: 'Own an airport', check: s => s.buildings[8] >= 1 },
    { id: 'spaceport_1', name: 'To Infinity', desc: 'Own a spaceport', check: s => s.buildings[9] >= 1 }
];

const moneyEl = document.getElementById('money');
const incomeEl = document.getElementById('income');
const shopItemsEl = document.getElementById('shopItems');
const buyModesEl = document.getElementById('buyModes');
const statsEl = document.getElementById('stats');
const achievementsEl = document.getElementById('achievements');
const toastsEl = document.getElementById('toasts');
const shopPanel = document.getElementById('shopPanel');
const shopBackdrop = document.getElementById('shopBackdrop');
const shopToggle = document.getElementById('shopToggle');
const shopClose = document.getElementById('shopClose');
const prestigeInfoEl = document.getElementById('prestigeInfo');
const prestigeBtn = document.getElementById('prestigeBtn');
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

let cpBtn = null;
let buildingBtns = [];
let buyAmount = 1;

// ---- scene animation state ----
const planeW = 19, planeH = 12, planeHitPad = 4;
let planeX = Math.floor(PIXEL_W / 2 - planeW / 2);
let planeY = 46;
let frame = 0;
let scrollX = 0;
let floaters = [];
let lastPlaneClick = performance.now();
let balloon = null;
let nextBalloonAt = performance.now() + 25000;
let combo = 0;
let comboEndsAt = 0;
let lastComboMult = 1;
let birds = [];
let nextBirdsAt = performance.now() + 45000;

const clouds = [
    { x: 40,  y: 25, w: 12 },
    { x: 130, y: 15, w: 8  },
    { x: 230, y: 40, w: 16 }
];

// distant background skyline (parallax backdrop for the city)
const skylineBuildings = [];
for (let i = 0; i < 16; i++) {
    skylineBuildings.push({
        x: i * 24,
        w: 14 + ((i * 7 + 3) % 10),
        h: 12 + ((i * 13 + 5) % 26)
    });
}
const SKYLINE_SPAN = 16 * 24;

// ---- helpers ----
function buildingCostAt(i, owned) {
    return Math.floor(buildings[i].baseCost * Math.pow(buildings[i].costMult, owned));
}
function buildingCost(i) {
    return buildingCostAt(i, state.buildings[i]);
}
function bulkCost(i, n) {
    const c = buildings[i];
    return Math.floor(c.baseCost * Math.pow(c.costMult, state.buildings[i]) * (Math.pow(c.costMult, n) - 1) / (c.costMult - 1));
}
function maxAffordable(i) {
    let money = state.money;
    let count = 0;
    while (count < 50000) {
        const cost = buildingCostAt(i, state.buildings[i] + count);
        if (cost > money) break;
        money -= cost;
        count++;
    }
    return count;
}
function buildingsToBuy(i) {
    if (buyAmount === Infinity) return maxAffordable(i);
    let count = 0;
    let money = state.money;
    while (count < buyAmount) {
        const cost = buildingCostAt(i, state.buildings[i] + count);
        if (cost > money) break;
        money -= cost;
        count++;
    }
    return count;
}
function buildingBuyInfo(i) {
    const n = buildingsToBuy(i);
    return { n, cost: n > 0 ? bulkCost(i, n) : buildingCost(i) };
}
function clickCost() {
    return Math.floor(10 * Math.pow(1.5, state.clickLevel));
}
function buildingMult(i) {
    const owned = state.buildings[i];
    let mult = 1;
    MILESTONES.forEach(m => { if (owned >= m) mult *= 2; });
    return mult;
}
function nextMilestone(i) {
    const owned = state.buildings[i];
    for (const m of MILESTONES) if (owned < m) return m;
    return null;
}
function incomePerSec() {
    const base = buildings.reduce((sum, b, i) => sum + b.income * state.buildings[i] * buildingMult(i), 0);
    return base * incomeMult();
}
function incomeMult() {
    return (1 + 0.05 * state.achievements.length) * (1 + 0.10 * state.prestige);
}
function prestigePointsForEarned(x) {
    return Math.floor(Math.sqrt(x / PRESTIGE_DIVISOR));
}
function pendingPrestige() {
    return Math.max(0, prestigePointsForEarned(state.totalEarned) - state.prestige);
}
function comboMult() {
    return 1 + combo * 0.1;
}
function fmt(n) {
    if (n < 1000) return Math.floor(n).toString();
    const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    let i = -1;
    while (n >= 1000 && i < units.length - 1) { n /= 1000; i++; }
    if (i >= units.length - 1) return n.toExponential(2).replace('+', '');
    return n.toFixed(2).replace(/\.?0+$/, '') + units[i];
}
function getBuildingLayers() {
    const layers = LAYERS.map(() => ({ list: [], width: PIXEL_W }));
    const cursors = LAYERS.map(() => 0);
    buildings.forEach((b, tier) => {
        const s = BUILDING_STYLES[tier];
        const layer = s.layer;
        for (let i = 0; i < state.buildings[tier]; i++) {
            layers[layer].list.push({
                tier,
                x: cursors[layer],
                yj: ((i * 37 + tier * 13) % 5) - 2
            });
            // Slight overlap (s.w - 2) so buildings touch/overlap, letting
            // more of the city fit on screen while back-to-front layering
            // still gives natural depth.
            cursors[layer] += s.w - 2;
        }
    });
    layers.forEach((layer, idx) => {
        if (cursors[idx] > layer.width) layer.width = cursors[idx];
    });
    return layers;
}

// ---- buy actions ----
function buyClickPower() {
    if (state.money >= clickCost()) {
        state.money -= clickCost();
        state.clickLevel++;
        state.clickPower++;
        update();
    }
}
function buyBuilding(i) {
    const { n, cost } = buildingBuyInfo(i);
    if (n > 0 && state.money >= cost) {
        state.money -= cost;
        state.buildings[i] += n;
        update();
    }
}
function clickPlane() {
    const now = performance.now();
    if (now < comboEndsAt) combo = Math.min(combo + 1, COMBO_CAP);
    else combo = 1;
    comboEndsAt = now + COMBO_WINDOW;
    lastComboMult = comboMult();
    if (combo > state.bestCombo) state.bestCombo = combo;

    const crit = Math.random() < 0.05;
    const amount = Math.round(state.clickPower * comboMult() * (crit ? 10 : 1));
    state.money += amount;
    state.totalEarned += amount;
    state.totalClicks++;
    lastPlaneClick = now;
    floaters.push({ x: planeX, y: planeY, text: (crit ? 'CRIT +$' : '+$') + fmt(amount), crit: crit, life: 40 });
    update();
}

// ---- prestige ----
function doPrestige() {
    const gain = pendingPrestige();
    if (gain <= 0) return;
    if (!confirm('Prestige for +' + gain + ' prestige point' + (gain > 1 ? 's' : '') + '?\n\nEach point gives a permanent +10% income.\nMoney, buildings, and click power reset; achievements and lifetime stats are kept.')) return;
    state.prestige += gain;
    state.money = 0;
    state.clickPower = 1;
    state.clickLevel = 0;
    state.buildings = buildings.map(() => 0);
    save();
    update();
    showToast('⭐ Prestige! +' + gain + ' point' + (gain > 1 ? 's' : '') + ' (+' + (gain * 10) + '% income)');
}

// ---- save export / import ----
function exportSave() {
    const json = JSON.stringify(state);
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json).then(() => showToast('💾 Save copied to clipboard')).catch(() => prompt('Copy your save:', json));
    } else {
        prompt('Copy your save:', json);
    }
}
function importSave() {
    const raw = prompt('Paste your save JSON:');
    if (!raw) return;
    try {
        loadFrom(JSON.parse(raw));
        save();
        update();
        showToast('✅ Save imported');
    } catch (e) {
        showToast('❌ Invalid save data');
    }
}

// ---- shop UI (built once) ----
function createShop() {
    const cpDiv = document.createElement('div');
    cpDiv.className = 'item';
    cpBtn = document.createElement('button');
    cpBtn.onclick = buyClickPower;
    cpDiv.appendChild(cpBtn);
    shopItemsEl.appendChild(cpDiv);

    buildingBtns = buildings.map((b, i) => {
        const div = document.createElement('div');
        div.className = 'item';
        const btn = document.createElement('button');
        btn.onclick = () => buyBuilding(i);
        const sub = document.createElement('div');
        sub.className = 'item-sub';
        sub.id = 'bsub' + i;
        div.appendChild(btn);
        div.appendChild(sub);
        shopItemsEl.appendChild(div);
        return btn;
    });
}

function createBuyModes() {
    const modes = [
        { label: 'x1', value: 1 },
        { label: 'x10', value: 10 },
        { label: 'Max', value: Infinity }
    ];
    modes.forEach(m => {
        const btn = document.createElement('button');
        btn.textContent = m.label;
        btn.dataset.value = String(m.value);
        btn.onclick = () => {
            buyAmount = m.value;
            updateBuyModes();
            update();
        };
        buyModesEl.appendChild(btn);
    });
    updateBuyModes();
}

function updateBuyModes() {
    [...buyModesEl.children].forEach(btn => {
        btn.classList.toggle('active', String(buyAmount) === btn.dataset.value);
    });
}

function openShop() {
    shopPanel.classList.add('open');
    shopBackdrop.classList.add('open');
}
function closeShop() {
    shopPanel.classList.remove('open');
    shopBackdrop.classList.remove('open');
}

function update() {
    checkAchievements();

    moneyEl.textContent = '$' + fmt(state.money);
    incomeEl.textContent = '$' + fmt(incomePerSec()) + ' / sec';

    cpBtn.textContent = 'Click Power (lvl ' + state.clickLevel + ') - $' + fmt(clickCost());
    cpBtn.disabled = state.money < clickCost();

    buildings.forEach((b, i) => {
        const { n, cost } = buildingBuyInfo(i);
        buildingBtns[i].textContent = b.name + ' (' + state.buildings[i] + ') - $' + fmt(cost) + (n > 1 ? ' (×' + n + ')' : '');
        buildingBtns[i].disabled = n === 0;
    });

    buildings.forEach((b, i) => {
        const sub = document.getElementById('bsub' + i);
        if (!sub) return;
        const mult = buildingMult(i);
        const nm = nextMilestone(i);
        sub.textContent = (mult > 1 ? '×' + mult + ' income' : '') + (nm ? (mult > 1 ? ' · ' : '') + '×2 at ' + nm + ' owned' : '');
    });

    const pPending = pendingPrestige();
    prestigeInfoEl.textContent = state.prestige + ' point' + (state.prestige === 1 ? '' : 's') + ' · +' + (state.prestige * 10) + '% income' + (pPending > 0 ? ' — ' + pPending + ' ready to claim!' : '');
    prestigeBtn.disabled = pPending <= 0;

    updateMeta();
}

function updateMeta() {
    const owned = state.buildings.reduce((a, b) => a + b, 0);
    statsEl.innerHTML =
        '<h3>Stats</h3>' +
        '<div><span class="stat-label">Clicks:</span> ' + fmt(state.totalClicks) + '</div>' +
        '<div><span class="stat-label">Earned:</span> $' + fmt(state.totalEarned) + '</div>' +
        '<div><span class="stat-label">Buildings:</span> ' + owned + '</div>' +
        '<div><span class="stat-label">Best combo:</span> ×' + state.bestCombo + '</div>' +
        '<div><span class="stat-label">Prestige:</span> ' + state.prestige + ' (+' + (state.prestige * 10) + '%)</div>' +
        '<div><span class="stat-label">Income bonus:</span> +' + Math.round((incomeMult() - 1) * 100) + '%</div>';

    achievementsEl.innerHTML =
        '<h3>Achievements (' + state.achievements.length + '/' + ACHIEVEMENTS.length + ')</h3>' +
        ACHIEVEMENTS.map(a => {
            const unlocked = state.achievements.includes(a.id);
            return '<div class="achievement' + (unlocked ? '' : ' locked') + '">' +
                '<span class="a-name">' + (unlocked ? '✓ ' : '🔒 ') + a.name + '</span>' +
                '<span>' + a.desc + '</span></div>';
        }).join('');
}

function checkAchievements() {
    ACHIEVEMENTS.forEach(a => {
        if (!state.achievements.includes(a.id) && a.check(state)) {
            state.achievements.push(a.id);
            showToast('🏆 ' + a.name + ' — ' + a.desc + ' (+5% income)');
        }
    });
}

function showToast(text) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    toastsEl.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s ease';
        setTimeout(() => el.remove(), 320);
    }, 4000);
}

// ---- pixel-art drawing ----
function drawBrickBuilding(x, y, w, h, body, dark) {
    ctx.fillStyle = body;
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = dark;
    const brickH = 3;
    for (let row = 0; row * brickH < h; row++) {
        const yy = y + row * brickH;
        ctx.fillRect(x, yy, w, 1);
        const off = (row % 2) * 3;
        for (let col = off; col < w; col += 6) {
            ctx.fillRect(x + col, yy, 1, brickH);
        }
    }

    ctx.fillStyle = '#ffd23f';
    for (let wx = x + 2; wx < x + w - 2; wx += 5) {
        for (let wy = y + 3; wy < y + h - 4; wy += 6) {
            ctx.fillRect(wx, wy, 2, 3);
        }
    }

    if (w >= 20) { // chimney for big buildings
        ctx.fillStyle = dark;
        ctx.fillRect(x + w - 6, y - 5, 3, 5);
        ctx.fillStyle = '#999';
        ctx.fillRect(x + w - 6, y - 6, 3, 1);
    }
}

function drawWarehouse(x, y, w, h, body, dark) {
    drawBrickBuilding(x, y, w, h, body, dark);
    // sawtooth roof
    ctx.fillStyle = dark;
    for (let rx = x + 1; rx < x + w - 2; rx += 5) {
        ctx.fillRect(rx, y - 2, 4, 2);
    }
    // loading bay
    ctx.fillStyle = dark;
    ctx.fillRect(x + w - 9, y + h - 6, 6, 6);
}

function drawMall(x, y, w, h, body, dark) {
    drawBrickBuilding(x, y, w, h, body, dark);
    // rooftop sign
    ctx.fillStyle = '#ffd23f';
    ctx.fillRect(x + Math.floor(w / 2) - 5, y - 3, 10, 3);
    // entrance awning
    ctx.fillStyle = dark;
    ctx.fillRect(x + Math.floor(w / 2) - 4, y + h - 5, 8, 5);
}

function drawDome(x, y, w, h, body, dark) {
    const baseH = Math.ceil(h * 0.45);
    const domeH = h - baseH;
    ctx.fillStyle = body;
    ctx.fillRect(x, y + domeH, w, baseH);
    for (let yy = 1; yy <= domeH; yy++) {
        const rowW = Math.max(2, Math.round(w * Math.pow(yy / domeH, 2)));
        ctx.fillRect(x + Math.floor((w - rowW) / 2), y + yy - 1, rowW, 1);
    }
    // panel stripes on the dome
    ctx.fillStyle = dark;
    for (let sx = x + 3; sx < x + w - 2; sx += 6) {
        ctx.fillRect(sx, y + 1, 1, domeH - 1);
    }
}

function drawTower(x, y, w, h, body, dark) {
    drawBrickBuilding(x, y, w, h, body, dark);
    // antenna mast
    ctx.fillStyle = '#999';
    ctx.fillRect(x + Math.floor(w / 2) - 1, y - 7, 2, 7);
    // blinking beacon
    if (frame % 10 < 5) {
        ctx.fillStyle = '#ff5c5c';
        ctx.fillRect(x + Math.floor(w / 2) - 2, y - 9, 4, 2);
    }
}

function drawBuilding(kind, x, y, w, h, body, dark) {
    if (kind === 'warehouse') return drawWarehouse(x, y, w, h, body, dark);
    if (kind === 'mall') return drawMall(x, y, w, h, body, dark);
    if (kind === 'dome') return drawDome(x, y, w, h, body, dark);
    if (kind === 'tower') return drawTower(x, y, w, h, body, dark);
    drawBrickBuilding(x, y, w, h, body, dark);
}

function drawPlane(x, y) {
    ctx.fillStyle = '#d33';
    ctx.fillRect(x + 1, y + 1, 2, 2);            // tail fin
    ctx.fillStyle = '#a0a0a8';
    ctx.fillRect(x + 2, y + 3, 3, 3);            // tail
    ctx.fillStyle = '#c8c8d0';
    ctx.fillRect(x + 4, y + 5, 12, 3);           // fuselage
    ctx.fillRect(x + 13, y + 6, 4, 1);           // nose
    ctx.fillStyle = '#888894';
    ctx.fillRect(x + 7, y + 2, 5, 1);            // top wing
    ctx.fillRect(x + 7, y + 9, 5, 1);            // bottom wing
    ctx.fillStyle = '#d33';
    ctx.fillRect(x + 4, y + 5, 12, 1);           // stripe
    ctx.fillStyle = '#7cd8ff';
    ctx.fillRect(x + 14, y + 6, 2, 1);           // window
    ctx.fillStyle = '#333';
    if (frame % 6 < 3) {                          // spinning propeller
        ctx.fillRect(x + 17, y + 4, 1, 6);
    } else {
        ctx.fillRect(x + 17, y + 6, 1, 1);
        ctx.fillRect(x + 17, y + 9, 1, 1);
    }
}

function drawSkyline() {
    // distant background buildings (slow parallax, hazy silhouette)
    ctx.fillStyle = '#a9c8ea';
    skylineBuildings.forEach(b => {
        const sx = ((b.x - scrollX * 0.35) % SKYLINE_SPAN + SKYLINE_SPAN) % SKYLINE_SPAN;
        ctx.fillRect(sx, SKYLINE_Y - b.h, b.w, b.h);
        ctx.fillRect(sx - SKYLINE_SPAN, SKYLINE_Y - b.h, b.w, b.h);
    });
    // haze where the city meets the sky
    ctx.fillStyle = '#cfe4f7';
    ctx.fillRect(0, SKYLINE_Y - 1, PIXEL_W, 2);
}

function spawnBirds() {
    nextBirdsAt = performance.now() + 40000 + Math.random() * 30000;
    const count = 3 + Math.floor(Math.random() * 3);
    const baseY = 12 + Math.random() * 22;
    const speed = 0.5 + Math.random() * 0.4;
    birds = [];
    for (let i = 0; i < count; i++) {
        birds.push({ x: -12 - i * 14, y: baseY + (Math.random() * 4 - 2), speed });
    }
}

function drawBirds() {
    birds.forEach(b => {
        const x = Math.round(b.x);
        const y = Math.round(b.y);
        const wing = Math.sin(frame * 0.25 + b.x) > 0 ? 2 : 1;
        ctx.fillStyle = '#2d2d33';
        ctx.fillRect(x - 3, y - wing + 1, 3, 1);
        ctx.fillRect(x, y - wing + 1, 3, 1);
    });
}

function drawTrees(count) {
    for (let i = 0; i < count; i++) {
        const tx = Math.round(((i * 41 + 17 - scrollX * 1.6) % PIXEL_W + PIXEL_W) % PIXEL_W);
        const ty = PIXEL_H - 11;
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(tx + 1, ty, 2, 3);
        ctx.fillStyle = i % 2 ? '#2f7a2f' : '#358335';
        ctx.fillRect(tx - 2, ty - 4, 6, 4);
        ctx.fillRect(tx, ty - 6, 2, 2);
    }
}

function drawClickHint() {
    const now = performance.now();
    if (now - lastPlaneClick < 5000) return;
    const cx = Math.floor(planeX + planeW / 2);
    const pulse = Math.round(Math.sin(now * 0.006) * 2);
    const ay = Math.round(planeY - 16 + pulse);

    // label with white outline so it pops against the sky
    ctx.font = '9px monospace';
    const text = 'CLICK ME';
    const tw = Math.ceil(ctx.measureText(text).width);
    const w = tw + 8;
    const h = 13;
    const bx = Math.round(cx - w / 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx - 1, ay - h - 1, w + 2, h + 2);
    ctx.fillStyle = '#111111';
    ctx.fillRect(bx, ay - h, w, h);
    ctx.fillStyle = '#ffe14d';
    ctx.fillText(text, bx + 4, ay - 2);

    // bouncy down arrow pointing at the plane
    ctx.fillStyle = '#ffe14d';
    ctx.fillRect(cx - 1, ay, 3, 8);
    ctx.fillRect(cx - 4, ay + 6, 9, 3);
    ctx.fillRect(cx - 3, ay + 9, 7, 2);
}

function drawCombo() {
    if (combo < 2) return;
    const now = performance.now();
    const remaining = comboEndsAt - now;
    if (remaining <= 0) return;
    const cx = Math.floor(planeX + planeW / 2);
    const cy = planeY + planeH + 7;
    ctx.font = '9px monospace';
    const text = 'COMBO ×' + combo + ' (' + lastComboMult.toFixed(1) + 'x)';
    const tw = Math.ceil(ctx.measureText(text).width);
    const w = tw + 8;
    const h = 14;
    const bx = Math.round(cx - w / 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx - 1, cy - 1, w + 2, h + 2);
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(bx, cy, w, h);
    ctx.fillStyle = '#ff9f1c';
    ctx.fillText(text, bx + 4, cy + 11);
    ctx.fillStyle = '#ffd23f';
    ctx.fillRect(bx, cy + h - 1, Math.round(w * (remaining / COMBO_WINDOW)), 1);
}

function spawnBalloon() {
    nextBalloonAt = performance.now() + 25000 + Math.random() * 20000;
    balloon = {
        x: PIXEL_W + 12,
        y: 16 + Math.random() * 30,
        value: Math.max(50, Math.round(incomePerSec() * 20))
    };
}

function drawBalloon() {
    if (!balloon) return;
    const x = Math.round(balloon.x);
    const y = Math.round(balloon.y + Math.sin(frame * 0.03) * 3);

    // envelope
    ctx.fillStyle = '#e2483d';
    const rows = [4, 6, 8, 10, 10, 10, 10, 10, 10, 8, 6, 4];
    rows.forEach((w, i) => {
        ctx.fillRect(x + (14 - w) / 2, y + i, w, 1);
    });
    ctx.fillStyle = '#f6d365';
    ctx.fillRect(x + 2, y + 6, 10, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(x + 3, y + 2, 2, 3);

    // ropes
    ctx.fillStyle = '#6b6f76';
    ctx.fillRect(x + 5, y + 12, 1, 3);
    ctx.fillRect(x + 8, y + 12, 1, 3);

    // basket
    ctx.fillStyle = '#7a4a2a';
    ctx.fillRect(x + 4, y + 15, 6, 4);
    ctx.fillRect(x + 5, y + 14, 4, 1);
}

function drawScene() {
    // sky
    ctx.fillStyle = '#9ad0ff';
    ctx.fillRect(0, 0, PIXEL_W, SKYLINE_Y);

    // background city + haze (behind everything else)
    drawSkyline();

    // clouds (slow parallax)
    ctx.fillStyle = '#ffffff';
    clouds.forEach(c => {
        const span = PIXEL_W + 40;
        const cx = ((c.x - scrollX * 0.4) % span + span) % span - 20;
        ctx.fillRect(cx, c.y, c.w, 4);
    });

    // occasional flock of birds
    drawBirds();

    // ground plane from the horizon down
    ctx.fillStyle = '#3f9b3f';
    ctx.fillRect(0, SKYLINE_Y, PIXEL_W, PIXEL_H - SKYLINE_Y);
    ctx.fillStyle = '#358335';
    ctx.fillRect(0, SKYLINE_Y, PIXEL_W, 2);

    // scrolling grass tufts (mid-ground parallax)
    ctx.fillStyle = '#2f7a2f';
    for (let i = 0; i < 8; i++) {
        const gx = ((i * 45 - scrollX) % PIXEL_W + PIXEL_W) % PIXEL_W;
        ctx.fillRect(gx, GROUND_Y + 5, 2, 4);
    }

    // player's buildings, layered back-to-front for natural depth
    const buildingLayers = getBuildingLayers();
    for (let li = LAYERS.length - 1; li >= 0; li--) {
        const layer = LAYERS[li];
        const layerData = buildingLayers[li];
        const baseY = GROUND_Y - layer.groundOffset;
        layerData.list.forEach(b => {
            const s = BUILDING_STYLES[b.tier];
            const span = layerData.width;
            const sx = ((b.x - scrollX * layer.speed) % span + span) % span;
            // Draw wrap copies on both sides so buildings loop seamlessly
            // at the screen edges instead of vanishing mid-screen.
            [sx - span, sx, sx + span].forEach(x => {
                if (x + s.w <= 0 || x >= PIXEL_W) return;
                ctx.fillStyle = 'rgba(20, 50, 20, 0.25)';
                ctx.fillRect(x + 1, baseY, s.w - 2, 2);
                drawBuilding(s.kind, x, baseY - s.h + b.yj, s.w, s.h, s.body, s.dark);
            });
        });
    }

    // foreground grass strip (fast parallax, closest layer)
    ctx.fillStyle = '#2c6e34';
    ctx.fillRect(0, PIXEL_H - 12, PIXEL_W, 12);
    ctx.fillStyle = '#1f5227';
    for (let i = 0; i < 12; i++) {
        const gx = ((i * 33 - scrollX * 1.6) % PIXEL_W + PIXEL_W) % PIXEL_W;
        ctx.fillRect(gx, PIXEL_H - 8, 3, 8);
    }

    // trees: the bigger your city, the more greenery fills the foreground
    const totalOwned = state.buildings.reduce((a, b) => a + b, 0);
    drawTrees(Math.min(10, Math.floor(totalOwned / 10)));

    // plane centered, bobbing
    planeX = Math.floor(PIXEL_W / 2 - planeW / 2);
    planeY = 46 + Math.round(Math.sin(frame * 0.04) * 4);
    drawPlane(planeX, planeY);
    drawClickHint();
    drawCombo();
    drawBalloon();

    // floating +$ text (crits and balloon payouts are bigger and gold)
    floaters.forEach(f => {
        const big = !!f.crit;
        const fontPx = big ? 10 : 9;
        ctx.font = fontPx + 'px monospace';
        const tw = Math.ceil(ctx.measureText(f.text).width);
        // Round to whole pixels so scaled-up text stays crisp, not blurry
        const tx = Math.round(f.x);
        const ty = Math.round(f.y);
        const w = tw + 8;
        const h = fontPx + 4;
        ctx.fillStyle = big ? 'rgba(130, 20, 20, 0.9)' : 'rgba(0, 0, 0, 0.78)';
        ctx.fillRect(tx, ty, w, h);
        ctx.fillStyle = big ? '#ffd23f' : '#ffffff';
        ctx.fillText(f.text, tx + 4, ty + fontPx + 1);
    });
}

function animate() {
    frame++;
    scrollX += 1.2;

    const now = performance.now();
    if (!balloon && now >= nextBalloonAt) spawnBalloon();
    if (balloon) {
        balloon.x -= 0.65;
        if (balloon.x < -24) balloon = null;
    }
    if (!birds.length && now >= nextBirdsAt) spawnBirds();
    birds.forEach(b => { b.x += b.speed; });
    birds = birds.filter(b => b.x < PIXEL_W + 12);

    floaters = floaters.filter(f => f.life > 0);
    floaters.forEach(f => { f.y -= 0.5; f.life--; });

    drawScene();
    requestAnimationFrame(animate);
}

// ---- click the plane ----
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (PIXEL_W / rect.width);
    const py = (e.clientY - rect.top) * (PIXEL_H / rect.height);

    if (balloon) {
        const bx = Math.round(balloon.x);
        const by = Math.round(balloon.y + Math.sin(frame * 0.03) * 3);
        if (px >= bx && px <= bx + 14 && py >= by && py <= by + 20) {
            state.money += balloon.value;
            state.totalEarned += balloon.value;
            state.balloonsCaught++;
            floaters.push({ x: bx, y: by, text: '+$' + fmt(balloon.value), crit: true, life: 55 });
            balloon = null;
            update();
            return;
        }
    }

    if (px >= planeX && px <= planeX + planeW && py >= planeY - planeHitPad && py <= planeY + planeH + planeHitPad) {
        clickPlane();
    }
});

// ---- shop + reset + prestige + save settings ----
shopToggle.onclick = openShop;
shopClose.onclick = closeShop;
shopBackdrop.onclick = closeShop;
prestigeBtn.onclick = doPrestige;
document.getElementById('exportBtn').onclick = exportSave;
document.getElementById('importBtn').onclick = importSave;

// keyboard shortcuts: Space clicks the plane, Esc closes the shop
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeShop();
        return;
    }
    if (e.code === 'Space' && !shopPanel.classList.contains('open')) {
        e.preventDefault();
        // Don't re-trigger a shop button that still has focus
        if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
        clickPlane();
    }
});

document.getElementById('resetBtn').onclick = () => {
    if (!confirm('Reset all progress? This cannot be undone.')) return;
    state = { money: 0, clickPower: 1, clickLevel: 0, buildings: buildings.map(() => 0), totalClicks: 0, totalEarned: 0, achievements: [], balloonsCaught: 0, prestige: 0, bestCombo: 0, lastSaved: 0 };
    save();
    update();
};

function save() {
    state.lastSaved = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
function loadFrom(data) {
    state.money = data.money ?? 0;
    state.clickPower = data.clickPower ?? 1;
    state.clickLevel = data.clickLevel ?? 0;
    state.buildings = data.buildings ?? buildings.map(() => 0);
    while (state.buildings.length < buildings.length) state.buildings.push(0);
    state.buildings.length = buildings.length;
    state.totalClicks = data.totalClicks ?? 0;
    state.totalEarned = data.totalEarned ?? 0;
    state.achievements = Array.isArray(data.achievements) ? data.achievements : [];
    state.balloonsCaught = data.balloonsCaught ?? 0;
    state.prestige = data.prestige ?? 0;
    state.bestCombo = data.bestCombo ?? 0;
    state.lastSaved = data.lastSaved ?? 0;
}
function load() {
    try {
        const data = JSON.parse(localStorage.getItem(SAVE_KEY));
        if (!data) return;
        loadFrom(data);
    } catch (e) {}
}

function applyOfflineEarnings() {
    if (!state.lastSaved) return;
    const elapsed = Math.floor((Date.now() - state.lastSaved) / 1000);
    if (elapsed < 60) return;
    const capped = Math.min(elapsed, 8 * 3600);
    const earned = incomePerSec() * capped * 0.5;
    if (earned < 1) return;
    state.money += earned;
    state.totalEarned += earned;
    const hrs = Math.floor(capped / 3600);
    const mins = Math.floor((capped % 3600) / 60);
    const away = hrs > 0 ? hrs + 'h ' + mins + 'm' : mins + 'm';
    showToast('👋 Welcome back! Earned $' + fmt(earned) + ' while away (' + away + ')');
}

// ---- idle income + auto-save ----
setInterval(() => {
    const inc = incomePerSec() / 10;
    state.money += inc;
    state.totalEarned += inc;
    update();
}, 100);
setInterval(save, 1000);

load();
applyOfflineEarnings();
createShop();
createBuyModes();
update();
animate();
