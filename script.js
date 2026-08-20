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
    { name: 'Factory',    baseCost: 600000,       costMult: 1.15, income: 1200, pollution: 2 },
    { name: 'Warehouse',  baseCost: 1500000,      costMult: 1.15, income: 1400 },
    { name: 'Mall',       baseCost: 17000000,     costMult: 1.15, income: 7800 },
    { name: 'Stadium',    baseCost: 200000000,    costMult: 1.15, income: 44000 },
    { name: 'Airport',    baseCost: 2300000000,   costMult: 1.15, income: 260000 },
    { name: 'Spaceport',  baseCost: 26000000000,  costMult: 1.15, income: 1500000 },
    { name: 'Lunar Base', baseCost: 2.6e11,       costMult: 1.15, income: 8500000 },
    { name: 'Orbital Station', baseCost: 2.6e12,  costMult: 1.15, income: 48000000 },
    { name: 'Mars Colony', baseCost: 2.6e13,      costMult: 1.15, income: 260000000 },
    { name: 'Asteroid Mine', baseCost: 2.6e14,    costMult: 1.15, income: 1400000000 },
    { name: 'Dyson Swarm', baseCost: 2.6e15,      costMult: 1.15, income: 7500000000 },
    { name: 'AI Datacenter', baseCost: 2.6e16,    costMult: 1.15, income: 4.5e10, pollution: 1 },
    { name: 'Recycling Plant', baseCost: 2.6e17,  costMult: 1.15, income: 2.5e11, pollutionReduction: 8, map: 'earth' },
    { name: 'Hydro Dam',      baseCost: 8e17,      costMult: 1.15, income: 7e11, pollutionReduction: 3, map: 'earth' },
    { name: 'Terraforming Lab', baseCost: 2.6e18, costMult: 1.15, income: 1.8e12, map: 'mars' },
    { name: 'Quantum Relay',  baseCost: 8e18,      costMult: 1.15, income: 5e12, map: 'mars' }
];

// Nuclear map buildings (third map, unlocked after Mars)
const nuclearBuildings = [
    { name: 'Reactor Core',   baseCost: 1e22,  costMult: 1.15, income: 1e13, pollution: 3, map: 'nuclear' },
    { name: 'Cooling Tower',   baseCost: 1e23,  costMult: 1.15, income: 5e13, pollution: 2, map: 'nuclear' },
    { name: 'Waste Facility',  baseCost: 1e24,  costMult: 1.15, income: 2.5e14, pollution: 4, map: 'nuclear' },
    { name: 'Research Lab',    baseCost: 1e25,  costMult: 1.15, income: 1e15, pollution: 1, map: 'nuclear' },
    { name: 'Containment Pod', baseCost: 1e26,  costMult: 1.15, income: 5e15, pollutionReduction: 2, map: 'nuclear' },
    { name: 'Fusion Engine',   baseCost: 1e27,  costMult: 1.15, income: 2.5e16, map: 'nuclear' }
];

const BUILDING_STYLES = [
    { w: 14, h: 16, body: '#8b3a3a', dark: '#5e2323', layer: 0, kind: 'brick' }, // House
    { w: 18, h: 20, body: '#7a4a2a', dark: '#4e2d18', layer: 0, kind: 'brick' }, // Shop
    { w: 16, h: 28, body: '#b07840', dark: '#7a4d22', layer: 1, kind: 'brick' }, // Apartment
    { w: 20, h: 34, body: '#6b6f76', dark: '#464a50', layer: 2, kind: 'brick' }, // Office
    { w: 22, h: 44, body: '#4d5a6b', dark: '#303b49', layer: 2, kind: 'brick' }, // Skyscraper
    { w: 28, h: 26, body: '#6e7a86', dark: '#46505a', layer: 1, kind: 'factory' }, // Factory
    { w: 26, h: 20, body: '#8a6d4b', dark: '#5c4730', layer: 0, kind: 'warehouse' }, // Warehouse
    { w: 28, h: 30, body: '#5b8a72', dark: '#3a5c4a', layer: 1, kind: 'mall' }, // Mall
    { w: 30, h: 24, body: '#9aa0a8', dark: '#6a7078', layer: 1, kind: 'dome' }, // Stadium
    { w: 28, h: 38, body: '#8a93a0', dark: '#5c6470', layer: 2, kind: 'tower' }, // Airport
    { w: 30, h: 48, body: '#7d6ba8', dark: '#524378', layer: 2, kind: 'tower' },  // Spaceport
    { w: 30, h: 34, body: '#c8ccd4', dark: '#7a7f88', layer: 2, kind: 'rocket' }, // Lunar Base
    { w: 34, h: 40, body: '#6b9fd4', dark: '#3a5a80', layer: 2, kind: 'station' },// Orbital Station
    { w: 30, h: 28, body: '#b5654a', dark: '#7a3d28', layer: 1, kind: 'dome' },   // Mars Colony
    { w: 32, h: 30, body: '#8a6d4b', dark: '#54412c', layer: 1, kind: 'drill' },  // Asteroid Mine
    { w: 36, h: 24, body: '#3fa7ff', dark: '#1f5c8a', layer: 0, kind: 'solar' },  // Dyson Swarm
    { w: 32, h: 30, body: '#2b3a4a', dark: '#16222c', layer: 1, kind: 'datacenter' }, // AI Datacenter
    { w: 30, h: 24, body: '#4f9d69', dark: '#285a3a', layer: 1, kind: 'recycler' }, // Recycling Plant
    { w: 36, h: 32, body: '#5b8fa8', dark: '#2f5668', layer: 2, kind: 'hydro' }, // Hydro Dam
    { w: 34, h: 30, body: '#6bbf78', dark: '#31734a', layer: 1, kind: 'terraform' }, // Terraforming Lab
    { w: 34, h: 38, body: '#b88cff', dark: '#5f3e9c', layer: 2, kind: 'quantum' }, // Quantum Relay
    // Nuclear buildings
    { w: 24, h: 36, body: '#8a8a8a', dark: '#5a5a5a', layer: 2, kind: 'reactor' },  // Reactor Core
    { w: 20, h: 40, body: '#a0a0a0', dark: '#707070', layer: 2, kind: 'cooling' },   // Cooling Tower
    { w: 26, h: 22, body: '#6a7a3a', dark: '#4a5a2a', layer: 1, kind: 'waste' },    // Waste Facility
    { w: 22, h: 28, body: '#4a7a8a', dark: '#2a5a6a', layer: 1, kind: 'lab' },      // Research Lab
    { w: 28, h: 30, body: '#7a7a6a', dark: '#5a5a4a', layer: 2, kind: 'contain' },  // Containment Pod
    { w: 30, h: 34, body: '#3a8a5a', dark: '#1a6a3a', layer: 2, kind: 'fusion' }    // Fusion Engine
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
    buildings: buildings.concat(nuclearBuildings).map(() => 0),
    totalClicks: 0,
    totalEarned: 0,
    achievements: [],
    balloonsCaught: 0,
    rebirths: 0,
    bestCombo: 0,
    frenziesTriggered: 0,
    boostsCaught: 0,
    lastSaved: 0
};

// Building milestones: doubling that building type's income at these ownership counts
const MILESTONES = [25, 50, 100, 200];
// Rebirth: reset for a permanent +25% income bonus. Cost scales up each time.
const REBIRTH_BASE = 1e7;
// Click combo: clicking within the window builds a temporary click multiplier
const COMBO_WINDOW = 2500;
const COMBO_CAP = 30;
// Golden Plane frenzy: a timed click-multiplier event
const FRENZY_DURATION = 15000;
const FRENZY_MULT = 7;
// Income boost plane: a timed passive-income multiplier event
const BOOST_DURATION = 45000;
const BOOST_MULT = 3;

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
    { id: 'warehouse_25', name: 'Logistics Lord', desc: 'Own 25 warehouses', check: s => s.buildings[6] >= 25 },
    { id: 'factory_10', name: 'Smokestack', desc: 'Own 10 factories', check: s => s.buildings[5] >= 10 },
    { id: 'mall_10', name: 'Retail King', desc: 'Own 10 malls', check: s => s.buildings[7] >= 10 },
    { id: 'stadium_5', name: 'Home Field Advantage', desc: 'Own 5 stadiums', check: s => s.buildings[8] >= 5 },
    { id: 'airport_1', name: 'Clear for Takeoff', desc: 'Own an airport', check: s => s.buildings[9] >= 1 },
    { id: 'spaceport_1', name: 'To Infinity', desc: 'Own a spaceport', check: s => s.buildings[10] >= 1 },
    { id: 'frenzy', name: 'Strike Gold', desc: 'Trigger a Golden Plane frenzy', check: s => s.frenziesTriggered >= 1 },
    { id: 'boost', name: 'Tailwind', desc: 'Catch an income boost plane', check: s => s.boostsCaught >= 1 },
    { id: 'lunar_1', name: 'One Small Step', desc: 'Own a Lunar Base', check: s => s.buildings[11] >= 1 },
    { id: 'station_1', name: 'Orbital', desc: 'Own an Orbital Station', check: s => s.buildings[12] >= 1 },
    { id: 'mars_1', name: 'Red Planet', desc: 'Own a Mars Colony', check: s => s.buildings[13] >= 1 },
    { id: 'mine_1', name: 'Belt and Braces', desc: 'Own an Asteroid Mine', check: s => s.buildings[14] >= 1 },
    { id: 'swarm_1', name: 'Star Power', desc: 'Own a Dyson Swarm', check: s => s.buildings[15] >= 1 },
    { id: 'datacenter_1', name: 'Compute Core', desc: 'Own an AI Datacenter', check: s => s.buildings[16] >= 1 },
    { id: 'datacenter_10', name: 'Smog City', desc: 'Own 10 AI Datacenters', check: s => s.buildings[16] >= 10 },
    { id: 'recycler_1', name: 'Clean Machine', desc: 'Own a Recycling Plant', check: s => s.buildings[17] >= 1 },
    { id: 'hydro_1', name: 'Water Works', desc: 'Own a Hydro Dam', check: s => s.buildings[18] >= 1 },
    { id: 'terraform_1', name: 'Green Mars', desc: 'Own a Terraforming Lab', check: s => s.buildings[19] >= 1 },
    { id: 'quantum_1', name: 'Quantum Leap', desc: 'Own a Quantum Relay', check: s => s.buildings[20] >= 1 },
    { id: 'reactor_1', name: 'Critical Mass', desc: 'Own a Reactor Core', check: s => s.buildings[21] >= 1 },
    { id: 'reactor_10', name: 'Nuclear Winter', desc: 'Own 10 Reactor Cores', check: s => s.buildings[21] >= 10 },
    { id: 'fusion_1', name: 'Fusion Master', desc: 'Own a Fusion Engine', check: s => s.buildings[26] >= 1 }
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
const rebirthInfoEl = document.getElementById('rebirthInfo');
const rebirthBtn = document.getElementById('rebirthBtn');
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const clickSoundEl = document.getElementById('clickSound');

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
let frenzy = { active: false, endsAt: 0, nextAt: performance.now() + 90000 };
let boost = { active: false, endsAt: 0 };
let boostPlane = null;
let nextBoostAt = performance.now() + 200000;
let easedPollution = 0;

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
    const allBuildings = buildings.concat(nuclearBuildings);
    return Math.floor(allBuildings[i].baseCost * Math.pow(allBuildings[i].costMult, owned));
}
function buildingCost(i) {
    return buildingCostAt(i, state.buildings[i]);
}
function bulkCost(i, n) {
    const c = buildings.concat(nuclearBuildings)[i];
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
function clickLevelCostAt(level) {
    return Math.floor(10 * Math.pow(1.5, level));
}
function clickCost() {
    return clickLevelCostAt(state.clickLevel);
}
function clickPowerBulkCost(n) {
    let total = 0;
    for (let k = 0; k < n; k++) total += clickLevelCostAt(state.clickLevel + k);
    return total;
}
function clickLevelsAffordable() {
    let money = state.money;
    let count = 0;
    while (count < 50000) {
        const cost = clickLevelCostAt(state.clickLevel + count);
        if (cost > money) break;
        money -= cost;
        count++;
    }
    return count;
}
function clickLevelsToBuy() {
    if (buyAmount === Infinity) return clickLevelsAffordable();
    let count = 0;
    let money = state.money;
    while (count < buyAmount) {
        const cost = clickLevelCostAt(state.clickLevel + count);
        if (cost > money) break;
        money -= cost;
        count++;
    }
    return count;
}
function clickPowerBuyInfo() {
    const n = clickLevelsToBuy();
    return { n, cost: n > 0 ? clickPowerBulkCost(n) : clickCost() };
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
// Each building tier belongs to Earth (city tiers) or Mars (space tiers).
function buildingMap(i) {
    if (i < buildings.length) return buildings[i].map || (i >= 10 ? 'mars' : 'earth');
    const ni = i - buildings.length;
    return nuclearBuildings[ni] ? nuclearBuildings[ni].map : 'earth';
}
function incomePerSec() {
    const all = buildings.concat(nuclearBuildings);
    const base = all.reduce((sum, b, i) => sum + (buildingMap(i) === currentMap ? b.income * state.buildings[i] * buildingMult(i) : 0), 0);
    return base * incomeMult() * boostMult() * (1 - pollutionPenalty());
}
function incomeMult() {
    return (1 + 0.05 * state.achievements.length) * (1 + 0.25 * state.rebirths);
}
function comboMult() {
    return 1 + combo * 0.1;
}
function boostMult() {
    return boost.active && performance.now() < boost.endsAt ? BOOST_MULT : 1;
}
function frenzyActive() {
    return frenzy.active && performance.now() < frenzy.endsAt;
}
// Pollution is based on total Earth building count, scaled by rebirths.
// More buildings = more smog. More rebirths = industry intensifies.
function earthPollution() {
    const total = buildings.reduce((sum, b, i) => sum + (buildingMap(i) === 'earth' ? state.buildings[i] : 0), 0);
    if (total <= 0) return 0;
    const base = Math.log10(total + 1) / 4;
    const rebirthBoost = 1 + state.rebirths * 0.002;
    return Math.min(1, base * rebirthBoost);
}
function earthPollutionLevel() {
    return earthPollution();
}
// River pollution on nuclear map: based on nuclear building count
function nuclearRiverPollution() {
    const total = buildings.concat(nuclearBuildings).reduce((sum, b, i) => sum + (buildingMap(i) === 'nuclear' ? state.buildings[i] : 0), 0);
    if (total <= 0) return 0;
    return Math.min(1, Math.log10(total + 1) / 3);
}
// For backward compat: pollution() now returns earth pollution as a raw score
function pollution() {
    return Math.round(earthPollution() * 100);
}
function pollutionPenalty() {
    return Math.min(earthPollution() * 0.3, 0.5);
}
function rebirthRequirement(n) {
    const r = n === undefined ? state.rebirths : n;
    // First 10: 10x per rebirth. After that: gentle 3% increase per rebirth.
    if (r <= 10) return REBIRTH_BASE * Math.pow(10, r);
    return REBIRTH_BASE * 1e10 * Math.pow(1.03, r - 10);
}
function rebirthProgress() {
    return Math.min(state.money / rebirthRequirement(), 1);
}
function smoothPollutionLevel() {
    return easedPollution;
}
function hexToRgb(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
function mixColor(a, b, t) {
    const ca = hexToRgb(a), cb = hexToRgb(b);
    const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
    const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
    const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
}
function fmt(n) {
    if (!isFinite(n)) return '\u221E';
    if (n < 1000) return Math.floor(n).toString();
    const prefixes = ['', 'U', 'D', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];
    const baseUnits = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];
    const groupNames = ['Dc', 'Vg', 'Tg', 'Qd', 'QiD', 'Sxg', 'Spg', 'Ocg', 'Nog', 'Cn'];
    const units = [...baseUnits];
    for (const g of groupNames) {
        for (const p of prefixes) units.push(p + g);
    }
    let i = -1;
    while (n >= 1000 && i < units.length - 1) { n /= 1000; i++; }
    return n.toFixed(2).replace(/\.?0+$/, '') + units[Math.max(0, i)];
}
const TILE_W = 1024;
let cachedLayers = null;
let layersDirty = true;
let layerTiles = [];
let beaconList = [];
let tilesDirty = true;
let metaSig = '';

// Persistent building slots so buying one type never reflows (and visually
// deletes) buildings of another type. These are synced lazily when counts change.
let placementSlots = { earth: [[], [], []], mars: [[], [], []], nuclear: [[], [], []] };
let placementCounts = buildings.concat(nuclearBuildings).map(() => 0);

function invalidateLayers() { layersDirty = true; tilesDirty = true; }

function getBuildingLayers() {
    if (!layersDirty && cachedLayers) return cachedLayers;
    cachedLayers = buildBuildingLayers();
    layersDirty = false;
    return cachedLayers;
}

function syncPlacements() {
    let changed = false;
    for (let tier = 0; tier < buildings.length + nuclearBuildings.length; tier++) {
        if (state.buildings[tier] !== placementCounts[tier]) { changed = true; break; }
    }
    if (!changed) return;

    // Decreases (reset/import) rebuild from scratch.
    const totalTiers = buildings.length + nuclearBuildings.length;
    const anyDecrease = Array.from({length: totalTiers}, (_, t) => t).some(t => state.buildings[t] < placementCounts[t]);
    if (anyDecrease) { buildPlacementsFromScratch(); return; }

    // Only increases: append new buildings at the end of their layer so
    // existing buildings keep their exact slot and never shift away.
    buildings.concat(nuclearBuildings).forEach((b, tier) => {
        const prev = placementCounts[tier];
        const current = state.buildings[tier];
        if (current <= prev) return;
        const s = BUILDING_STYLES[tier];
        const list = placementSlots[buildingMap(tier)][s.layer];
        let cursor = 0;
        if (list.length) {
            const last = list[list.length - 1];
            cursor = last.x + BUILDING_STYLES[last.tier].w - 2;
        }
        for (let i = prev; i < current; i++) {
            list.push({ tier, x: cursor, yj: ((i * 37 + tier * 13) % 5) - 2 });
            cursor += s.w - 2;
        }
        placementCounts[tier] = current;
    });
}

function buildPlacementsFromScratch() {
    placementSlots = { earth: [[], [], []], mars: [[], [], []], nuclear: [[], [], []] };
    const cursors = { earth: [0, 0, 0], mars: [0, 0, 0], nuclear: [0, 0, 0] };
    buildings.concat(nuclearBuildings).forEach((b, tier) => {
        const s = BUILDING_STYLES[tier];
        const map = buildingMap(tier);
        for (let i = 0; i < state.buildings[tier]; i++) {
            placementSlots[map][s.layer].push({
                tier,
                x: cursors[map][s.layer],
                yj: ((i * 37 + tier * 13) % 5) - 2
            });
            cursors[map][s.layer] += s.w - 2;
        }
        placementCounts[tier] = state.buildings[tier];
    });
}

function buildBuildingLayers() {
    syncPlacements();
    const layers = LAYERS.map(() => ({ list: [], width: PIXEL_W }));
    placementSlots[currentMap].forEach((list, li) => {
        layers[li].list = list.slice();
    });
    // Width must include the last building's full body, not just the cursor,
    // or the tile renderer clips the trailing building at the seam.
    layers.forEach((layer) => {
        let width = PIXEL_W;
        layer.list.forEach(b => {
            const right = b.x + BUILDING_STYLES[b.tier].w;
            if (right > width) width = right;
        });
        layer.width = width;
    });
    return layers;
}

// Pre-render each depth layer into fixed-width offscreen tiles. This is the
// key late-game optimization: per frame we blit a few tiles with drawImage
// instead of issuing hundreds/thousands of fillRect calls per building.
function buildLayerTiles(li, layerData) {
    const baseY = GROUND_Y - LAYERS[li].groundOffset;
    const tileCount = Math.max(1, Math.ceil(layerData.width / TILE_W));
    const tiles = [];
    for (let t = 0; t < tileCount; t++) {
        const c = document.createElement('canvas');
        c.width = Math.min(TILE_W, layerData.width - t * TILE_W);
        c.height = PIXEL_H;
        tiles.push({ canvas: c, ctx: c.getContext('2d'), x: t * TILE_W });
    }
    layerData.list.forEach(b => {
        const s = BUILDING_STYLES[b.tier];
        const first = Math.floor(b.x / TILE_W);
        const last = Math.floor((b.x + s.w - 1) / TILE_W);
        for (let t = first; t <= last; t++) {
            const tile = tiles[t];
            if (!tile) continue;
            const sx = b.x - tile.x;
            tile.ctx.fillStyle = 'rgba(20, 50, 20, 0.25)';
            tile.ctx.fillRect(sx + 1, baseY, s.w - 2, 2);
            drawBuilding(tile.ctx, s.kind, sx, baseY - s.h + b.yj, s.w, s.h, s.body, s.dark);
        }
    });
    return tiles;
}

function ensureTiles() {
    if (!tilesDirty) return;
    const layers = getBuildingLayers();
    layerTiles = layers.map((ld, li) => buildLayerTiles(li, ld));
    beaconList = [];
    layers.forEach((ld, li) => {
        const baseY = GROUND_Y - LAYERS[li].groundOffset;
        ld.list.forEach(b => {
            const s = BUILDING_STYLES[b.tier];
            if (s.kind === 'tower') beaconList.push({ li, b, s, baseY });
        });
    });
    tilesDirty = false;
}

// ---- buy actions ----
function buyClickPower() {
    const { n, cost } = clickPowerBuyInfo();
    if (n > 0 && state.money >= cost) {
        state.money -= cost;
        state.clickLevel += n;
        state.clickPower += n;
        update();
    }
}
function buyBuilding(i) {
    const { n, cost } = buildingBuyInfo(i);
    if (n > 0 && state.money >= cost) {
        state.money -= cost;
        state.buildings[i] += n;
        invalidateLayers();
        update();
    }
}
function playClickSound() {
    if (!clickSoundEl) return;
    try {
        clickSoundEl.currentTime = 0;
        const p = clickSoundEl.play();
        if (p) p.catch(() => {});
    } catch (e) {}
}
function clickPlane() {
    playClickSound();
    const now = performance.now();
    if (now < comboEndsAt) combo = Math.min(combo + 1, COMBO_CAP);
    else combo = 1;
    comboEndsAt = now + COMBO_WINDOW;
    lastComboMult = comboMult();
    if (combo > state.bestCombo) state.bestCombo = combo;

    const crit = Math.random() < 0.05;
    const frenzyOn = frenzyActive();
    const mult = comboMult() * (crit ? 10 : 1) * (frenzyOn ? FRENZY_MULT : 1);
    const amount = Math.round(state.clickPower * mult);
    state.money += amount;
    state.totalEarned += amount;
    state.totalClicks++;
    lastPlaneClick = now;
    let text = '+$' + fmt(amount);
    if (crit) text = 'CRIT +$' + fmt(amount);
    if (frenzyOn) text += ' ×' + FRENZY_MULT;
    floaters.push({ x: planeX, y: planeY, text: text, crit: crit || frenzyOn, life: 40 });
    update();
}

// Space-to-click, registered in the capture phase so it runs before the
// plain keydown handler lower in the file. Holding Space would otherwise
// fire repeated keydown events; stopImmediatePropagation keeps the later
// handler from also clicking on the same press.
document.addEventListener('keydown', (e) => {
    if (e.code !== 'Space' || shopPanel.classList.contains('open')) return;
    e.preventDefault();
    if (e.repeat) { e.stopImmediatePropagation(); return; }
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    clickPlane();
    e.stopImmediatePropagation();
}, true);

// ---- rebirth ----
function doRebirth() {
    const need = rebirthRequirement();
    if (state.money < need) return;
    if (!confirm('Rebirth for +25% permanent income?\n\nThis resets money, buildings, and click power. Your next rebirth costs $' + fmt(rebirthRequirement(state.rebirths + 1)) + '.')) return;
    state.rebirths++;
    state.money = 0;
    state.clickPower = 1;
    state.clickLevel = 0;
    state.buildings = buildings.concat(nuclearBuildings).map(() => 0);
    invalidateLayers();
    save();
    update();
    showToast('🌱 Rebirth #' + state.rebirths + '! +25% income forever');
}

// ---- save export / import ----
// Saves are base64-encoded AND checksummed, so casual players can't just
// decode, edit, and re-import the numbers. This is tamper-evident obfuscation
// for a purely client-side game — a determined hacker can still reverse it,
// but it blocks the easy "paste and cheat" path.
const SAVE_MAGIC = 'C1';
const SAVE_SALT = 'clih-save-v1-x7q';

function hash32(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).padStart(8, '0');
}
function encodeSave(obj) {
    const json = JSON.stringify(obj);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return SAVE_MAGIC + '.' + b64 + '.' + hash32(SAVE_SALT + b64);
}
function decodeSave(str) {
    if (!str) throw new Error('empty');
    const t = str.trim();
    // Accept old plain-JSON saves for backwards compatibility.
    if (t.charAt(0) === '{') return JSON.parse(t);
    const parts = t.split('.');
    if (parts.length !== 3 || parts[0] !== SAVE_MAGIC) throw new Error('format');
    if (hash32(SAVE_SALT + parts[1]) !== parts[2]) throw new Error('checksum');
    return JSON.parse(decodeURIComponent(escape(atob(parts[1]))));
}

function exportSave() {
    const encoded = encodeSave(state);
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(encoded).then(() => showToast('💾 Save copied to clipboard')).catch(() => prompt('Copy your save:', encoded));
    } else {
        prompt('Copy your save:', encoded);
    }
}
function importSave() {
    const raw = prompt('Paste your save code:');
    if (!raw) return;
    try {
        loadFrom(decodeSave(raw));
        save();
        update();
        showToast('✅ Save imported');
    } catch (e) {
        showToast('❌ Invalid or tampered save data');
    }
}

// ---- shop UI (rebuilt when the map changes) ----
function createShop() {
    shopItemsEl.innerHTML = '';
    const cpDiv = document.createElement('div');
    cpDiv.className = 'item';
    cpBtn = document.createElement('button');
    cpBtn.onclick = buyClickPower;
    cpDiv.appendChild(cpBtn);
    shopItemsEl.appendChild(cpDiv);

    const allBuildings = buildings.concat(nuclearBuildings);
    buildingBtns = allBuildings.map((b, i) => {
        if (buildingMap(i) !== currentMap) return null;
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

// ---- map switching (Earth / Mars) ----
const MARS_COST = 1e7;
const NUCLEAR_COST = 1e21;
const NUCLEAR_KEY = 'clih-nuclear-unlocked';
const MARS_KEY = 'clih-mars-unlocked';
let currentMap = 'earth';
const mapBtn = document.getElementById('mapBtn');

function marsUnlocked() {
    return localStorage.getItem(MARS_KEY) === '1';
}
function nuclearUnlocked() {
    return localStorage.getItem(NUCLEAR_KEY) === '1';
}

function updateMapBtn() {
    const labels = { earth: '🌍 Earth', mars: '🔴 Mars', nuclear: '☢️ Nuclear' };
    const next = { earth: 'mars', mars: nuclearUnlocked() ? 'nuclear' : 'earth', nuclear: 'earth' };
    const target = next[currentMap];
    if (target === 'earth') {
        mapBtn.textContent = '→ ' + labels.earth;
    } else if (target === 'mars' && marsUnlocked()) {
        mapBtn.textContent = '→ ' + labels.mars;
    } else if (target === 'nuclear' && nuclearUnlocked()) {
        mapBtn.textContent = '→ ' + labels.nuclear;
    } else if (target === 'mars') {
        mapBtn.textContent = '🚀 Mars ($' + fmt(MARS_COST) + ')';
    } else {
        mapBtn.textContent = '☢️ Nuclear ($' + fmt(NUCLEAR_COST) + ')';
    }
}
mapBtn.onclick = () => {
    const nextMap = { earth: 'mars', mars: nuclearUnlocked() ? 'nuclear' : 'earth', nuclear: 'earth' };
    const target = nextMap[currentMap];
    if ((target === 'earth') || (target === 'mars' && marsUnlocked()) || (target === 'nuclear' && nuclearUnlocked())) {
        currentMap = target;
        const labels = { earth: '🌍 Earth', mars: '🔴 Mars', nuclear: '☢️ Nuclear' };
        showToast('Switched to ' + labels[target]);
        invalidateLayers();
        createShop();
        update();
    } else if (target === 'mars' && state.money >= MARS_COST) {
        state.money -= MARS_COST;
        localStorage.setItem(MARS_KEY, '1');
        currentMap = 'mars';
        showToast('🔴 Mars unlocked!');
        invalidateLayers();
        createShop();
        update();
    } else if (target === 'nuclear' && state.money >= NUCLEAR_COST) {
        state.money -= NUCLEAR_COST;
        localStorage.setItem(NUCLEAR_KEY, '1');
        currentMap = 'nuclear';
        showToast('☢️ Nuclear map unlocked!');
        invalidateLayers();
        createShop();
        update();
    } else {
        const cost = target === 'mars' ? MARS_COST : NUCLEAR_COST;
        showToast('Need $' + fmt(cost) + ' to unlock ' + (target === 'mars' ? 'Mars' : 'Nuclear'));
    }
    updateMapBtn();
};
updateMapBtn();

let saveMigrated = false;
function migrateSave() {
    if (saveMigrated) return;
    saveMigrated = true;
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        // Factory was inserted at index 5; older saves kept the industrial
        // tiers one slot earlier. loadFrom already padded the array, so
        // splice the new slot in and drop the trailing zero.
        if (Array.isArray(data.buildings) && data.buildings.length < buildings.length) {
            state.buildings.splice(5, 0, 0);
            state.buildings.length = buildings.length;
            save();
        }
    } catch (e) {}
}

function update() {
    migrateSave();
    checkAchievements();

    moneyEl.textContent = '$' + fmt(state.money);
    incomeEl.textContent = '$' + fmt(incomePerSec()) + ' / sec';

    const cpInfo = clickPowerBuyInfo();
    cpBtn.textContent = 'Click Power (lvl ' + state.clickLevel + ') - $' + fmt(cpInfo.cost) + (cpInfo.n > 1 ? ' (×' + cpInfo.n + ')' : '');
    cpBtn.disabled = cpInfo.n === 0;

    buildings.concat(nuclearBuildings).forEach((b, i) => {
        if (!buildingBtns[i]) return;
        const { n, cost } = buildingBuyInfo(i);
        buildingBtns[i].textContent = b.name + ' (' + state.buildings[i] + ') - $' + fmt(cost) + (n > 1 ? ' (×' + n + ')' : '');
        buildingBtns[i].disabled = n === 0;
    });

    buildings.concat(nuclearBuildings).forEach((b, i) => {
        const sub = document.getElementById('bsub' + i);
        if (!sub) return;
        const mult = buildingMult(i);
        const nm = nextMilestone(i);
        let text = (mult > 1 ? '×' + mult + ' income' : '') + (nm ? (mult > 1 ? ' · ' : '') + '×2 at ' + nm + ' owned' : '');
        sub.textContent = text;
    });


    const rNeed = rebirthRequirement();
    const rp = rebirthProgress();
    rebirthInfoEl.textContent = state.rebirths + ' rebirth' + (state.rebirths === 1 ? '' : 's') + ' · +' + (state.rebirths * 25) + '% income' + (rp >= 1 ? ' — ready!' : ' — $' + fmt(rNeed) + ' needed');
    rebirthBtn.disabled = rp < 1;

    updateMeta();
}

function updateMeta() {
    const owned = state.buildings.reduce((a, b) => a + b, 0);
    // Only re-render stats/achievements when something actually changed;
    // update() runs 10×/sec so rebuilding this HTML every tick is wasteful.
    const sig = [state.totalClicks, state.totalEarned, owned, state.bestCombo, state.rebirths, state.achievements.length, state.frenziesTriggered, state.boostsCaught, pollution(), earthPollution(), currentMap].join(',');
    if (sig === metaSig) return;
    metaSig = sig;

    statsEl.innerHTML =
        '<h3>Stats</h3>' +
        '<div><span class="stat-label">Clicks:</span> ' + fmt(state.totalClicks) + '</div>' +
        '<div><span class="stat-label">Earned:</span> $' + fmt(state.totalEarned) + '</div>' +
        '<div><span class="stat-label">Buildings:</span> ' + owned + '</div>' +
        '<div><span class="stat-label">Best combo:</span> ×' + state.bestCombo + '</div>' +
        '<div><span class="stat-label">Rebirths:</span> ' + state.rebirths + ' (+' + (state.rebirths * 25) + '%)</div>' +
        '<div><span class="stat-label">Frenzies:</span> ' + state.frenziesTriggered + '</div>' +
        '<div><span class="stat-label">Boosts:</span> ' + state.boostsCaught + '</div>' +
        '<div><span class="stat-label">Income bonus:</span> +' + Math.round((incomeMult() - 1) * 100) + '%</div>' +
        '<div><span class="stat-label">Pollution:</span> ' + pollution() + '% (-' + Math.round(pollutionPenalty() * 100) + '% income)</div>';


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
function drawBrickBuilding(c, x, y, w, h, body, dark) {
    c.fillStyle = body;
    c.fillRect(x, y, w, h);

    c.fillStyle = dark;
    const brickH = 3;
    for (let row = 0; row * brickH < h; row++) {
        const yy = y + row * brickH;
        c.fillRect(x, yy, w, 1);
        const off = (row % 2) * 3;
        for (let col = off; col < w; col += 6) {
            c.fillRect(x + col, yy, 1, brickH);
        }
    }

    c.fillStyle = '#ffd23f';
    for (let wx = x + 2; wx < x + w - 2; wx += 5) {
        for (let wy = y + 3; wy < y + h - 4; wy += 6) {
            c.fillRect(wx, wy, 2, 3);
        }
    }

    if (w >= 20) { // chimney for big buildings
        c.fillStyle = dark;
        c.fillRect(x + w - 6, y - 5, 3, 5);
        c.fillStyle = '#999';
        c.fillRect(x + w - 6, y - 6, 3, 1);
    }
}

function drawWarehouse(c, x, y, w, h, body, dark) {
    drawBrickBuilding(c, x, y, w, h, body, dark);
    // sawtooth roof
    c.fillStyle = dark;
    for (let rx = x + 1; rx < x + w - 2; rx += 5) {
        c.fillRect(rx, y - 2, 4, 2);
    }
    // loading bay
    c.fillStyle = dark;
    c.fillRect(x + w - 9, y + h - 6, 6, 6);
}

function drawMall(c, x, y, w, h, body, dark) {
    drawBrickBuilding(c, x, y, w, h, body, dark);
    // rooftop sign
    c.fillStyle = '#ffd23f';
    c.fillRect(x + Math.floor(w / 2) - 5, y - 3, 10, 3);
    // entrance awning
    c.fillStyle = dark;
    c.fillRect(x + Math.floor(w / 2) - 4, y + h - 5, 8, 5);
}

function drawDome(c, x, y, w, h, body, dark) {
    const baseH = Math.ceil(h * 0.45);
    const domeH = h - baseH;
    c.fillStyle = body;
    c.fillRect(x, y + domeH, w, baseH);
    for (let yy = 1; yy <= domeH; yy++) {
        const rowW = Math.max(2, Math.round(w * Math.pow(yy / domeH, 2)));
        c.fillRect(x + Math.floor((w - rowW) / 2), y + yy - 1, rowW, 1);
    }
    // panel stripes on the dome
    c.fillStyle = dark;
    for (let sx = x + 3; sx < x + w - 2; sx += 6) {
        c.fillRect(sx, y + 1, 1, domeH - 1);
    }
}

function drawTower(c, x, y, w, h, body, dark) {
    drawBrickBuilding(c, x, y, w, h, body, dark);
    // antenna mast (beacon is drawn separately per frame, see drawTowerBeacons)
    c.fillStyle = '#999';
    c.fillRect(x + Math.floor(w / 2) - 1, y - 7, 2, 7);
}

function drawRocket(c, x, y, w, h, body, dark) {
    // launch pad
    c.fillStyle = dark;
    c.fillRect(x + 1, y + h - 3, w - 2, 3);
    c.fillStyle = '#8a93a0';
    c.fillRect(x + 2, y + h - 5, w - 4, 2);
    // rocket on the pad
    const rx = x + Math.floor(w / 2) - 2;
    const rh = h - 7;
    c.fillStyle = '#e8e8f0';
    c.fillRect(rx, y, 4, rh);
    c.fillStyle = '#d33';
    c.fillRect(rx, y + 2, 4, 2);          // nose stripe
    c.fillRect(rx - 1, y + rh - 4, 2, 4); // left fin
    c.fillRect(rx + 3, y + rh - 4, 2, 4); // right fin
    c.fillStyle = '#7cd8ff';
    c.fillRect(rx + 1, y + rh, 2, 2);     // window
}

function drawStation(c, x, y, w, h, body, dark) {
    // support gantry
    c.fillStyle = dark;
    c.fillRect(x + Math.floor(w / 2) - 4, y + h - 2, 8, 2);
    c.fillRect(x + Math.floor(w / 2) - 1, y + 6, 2, h - 8);
    // orbital ring
    c.fillStyle = body;
    c.fillRect(x + 2, y, w - 4, 6);
    c.fillRect(x + 4, y - 2, w - 8, 2);
    c.fillStyle = '#cfe4f7';
    c.fillRect(x + Math.floor(w / 2) - 3, y + 1, 6, 4);
}

function drawDrill(c, x, y, w, h, body, dark) {
    // rocky mound
    c.fillStyle = body;
    c.fillRect(x + 1, y + h - 5, w - 2, 5);
    c.fillRect(x + 3, y + h - 8, w - 6, 3);
    c.fillRect(x + 6, y + h - 11, w - 12, 3);
    // drill rig
    c.fillStyle = '#9aa0a8';
    c.fillRect(x + Math.floor(w / 2) - 1, y + 2, 2, h - 8);
    c.fillStyle = dark;
    c.fillRect(x + Math.floor(w / 2) - 3, y, 6, 3);
}

function drawSolar(c, x, y, w, h, body, dark) {
    // support legs
    c.fillStyle = dark;
    c.fillRect(x + 2, y + h - 3, 2, 3);
    c.fillRect(x + w - 4, y + h - 3, 2, 3);
    c.fillRect(x + 1, y + h - 2, w - 2, 2);
    // panel array
    c.fillStyle = body;
    for (let px = x + 2; px < x + w - 4; px += 5) {
        c.fillRect(px, y + 2, 4, 6);
    }
    c.fillStyle = '#cfe4f7';
    for (let px = x + 3; px < x + w - 3; px += 5) {
        c.fillRect(px, y + 3, 2, 4);
    }
}

function drawRecycling(c, x, y, w, h, body, dark) {
    drawBrickBuilding(c, x, y, w, h, body, dark);
    c.fillStyle = '#b8f28b';
    c.fillRect(x + 5, y + 5, 8, 3);
    c.fillRect(x + 9, y + 8, 4, 5);
    c.fillStyle = dark;
    c.fillRect(x + w - 9, y + h - 7, 6, 7);
    c.fillStyle = '#d5f5e3';
    c.fillRect(x + 4, y - 4, 3, 4);
    c.fillRect(x + w - 8, y - 5, 3, 5);
}

function drawHydro(c, x, y, w, h, body, dark) {
    c.fillStyle = body;
    c.fillRect(x, y + 8, w, h - 8);
    c.fillStyle = dark;
    c.fillRect(x, y + 6, w, 3);
    c.fillRect(x + 4, y + 12, 3, h - 12);
    c.fillRect(x + w - 7, y + 12, 3, h - 12);
    c.fillStyle = '#9fe8ff';
    for (let yy = y + 12; yy < y + h - 3; yy += 5) c.fillRect(x + 9, yy, w - 18, 2);
    c.fillStyle = '#d6f7ff';
    c.fillRect(x + Math.floor(w / 2) - 2, y + 1, 4, 5);
}

function drawTerraform(c, x, y, w, h, body, dark) {
    drawDome(c, x, y + 3, w, h - 3, body, dark);
    c.fillStyle = '#b8f28b';
    c.fillRect(x + 4, y + h - 5, w - 8, 2);
    c.fillRect(x + Math.floor(w / 2) - 1, y - 2, 2, 5);
}

function drawQuantum(c, x, y, w, h, body, dark) {
    c.fillStyle = dark;
    c.fillRect(x + 5, y + h - 4, w - 10, 4);
    c.fillStyle = body;
    c.fillRect(x + 3, y + 6, 4, h - 10);
    c.fillRect(x + w - 7, y + 6, 4, h - 10);
    c.fillRect(x + 6, y + 3, w - 12, 4);
    c.fillStyle = '#f5e9ff';
    c.fillRect(x + 9, y + 9, w - 18, h - 16);
    c.fillStyle = '#d8b4fe';
    c.fillRect(x + 13, y + 12, 3, 3);
    c.fillRect(x + w - 16, y + h - 10, 3, 3);
}

function drawDatacenter(c, x, y, w, h, body, dark) {
    // dark server-hall body
    c.fillStyle = body;
    c.fillRect(x, y, w, h);
    c.fillStyle = dark;
    c.fillRect(x, y, w, 2);
    // glowing server racks
    c.fillStyle = '#22d3ee';
    for (let wy = y + 3; wy < y + h - 3; wy += 4) {
        for (let wx = x + 2; wx < x + w - 2; wx += 4) {
            c.fillRect(wx, wy, 2, 2);
        }
    }
    // cooling stacks venting smoke
    c.fillStyle = dark;
    c.fillRect(x + 3, y - 4, 3, 4);
    c.fillRect(x + w - 6, y - 4, 3, 4);
    c.fillStyle = 'rgba(150,150,150,0.9)';
    c.fillRect(x + 4, y - 6, 1, 2);
    c.fillRect(x + w - 5, y - 6, 1, 2);
}

function drawFactory(c, x, y, w, h, body, dark) {
    drawBrickBuilding(c, x, y, w, h, body, dark);
    // sawtooth roof
    c.fillStyle = dark;
    for (let rx = x + 1; rx < x + w - 2; rx += 5) {
        c.fillRect(rx, y - 2, 4, 2);
    }
    // two smokestacks
    c.fillStyle = '#8a8a8a';
    c.fillRect(x + 4, y - 10, 3, 10);
    c.fillRect(x + w - 7, y - 12, 3, 12);
    // smoke plumes (static, baked into the tile)
    c.fillStyle = 'rgba(150,150,150,0.85)';
    c.fillRect(x + 5, y - 13, 1, 3);
    c.fillRect(x + w - 6, y - 15, 1, 3);
    // loading door
    c.fillStyle = dark;
    c.fillRect(x + Math.floor(w / 2) - 3, y + h - 6, 6, 6);
}

function drawBuilding(c, kind, x, y, w, h, body, dark) {
    if (kind === 'warehouse') return drawWarehouse(c, x, y, w, h, body, dark);
    if (kind === 'mall') return drawMall(c, x, y, w, h, body, dark);
    if (kind === 'dome') return drawDome(c, x, y, w, h, body, dark);
    if (kind === 'tower') return drawTower(c, x, y, w, h, body, dark);
    if (kind === 'rocket') return drawRocket(c, x, y, w, h, body, dark);
    if (kind === 'station') return drawStation(c, x, y, w, h, body, dark);
    if (kind === 'drill') return drawDrill(c, x, y, w, h, body, dark);
    if (kind === 'solar') return drawSolar(c, x, y, w, h, body, dark);
    if (kind === 'datacenter') return drawDatacenter(c, x, y, w, h, body, dark);
    if (kind === 'recycler') return drawRecycling(c, x, y, w, h, body, dark);
    if (kind === 'hydro') return drawHydro(c, x, y, w, h, body, dark);
    if (kind === 'terraform') return drawTerraform(c, x, y, w, h, body, dark);
    if (kind === 'quantum') return drawQuantum(c, x, y, w, h, body, dark);
    if (kind === 'factory') return drawFactory(c, x, y, w, h, body, dark);
    drawBrickBuilding(c, x, y, w, h, body, dark);
}

function drawPlane(x, y, gold) {
    const metal = gold ? '#ffe08a' : '#c8c8d0';
    const metalDark = gold ? '#f0b64a' : '#a0a0a8';
    const wing = gold ? '#e8a23a' : '#888894';
    const stripe = gold ? '#8a4a00' : '#d33';
    ctx.fillStyle = stripe;
    ctx.fillRect(x + 1, y + 1, 2, 2);            // tail fin
    ctx.fillStyle = metalDark;
    ctx.fillRect(x + 2, y + 3, 3, 3);            // tail
    ctx.fillStyle = metal;
    ctx.fillRect(x + 4, y + 5, 12, 3);           // fuselage
    ctx.fillRect(x + 13, y + 6, 4, 1);           // nose
    ctx.fillStyle = wing;
    ctx.fillRect(x + 7, y + 2, 5, 1);            // top wing
    ctx.fillRect(x + 7, y + 9, 5, 1);            // bottom wing
    ctx.fillStyle = stripe;
    ctx.fillRect(x + 4, y + 5, 12, 1);           // stripe
    ctx.fillStyle = gold ? '#6b4a00' : '#7cd8ff';
    ctx.fillRect(x + 14, y + 6, 2, 1);           // window
    ctx.fillStyle = '#333';
    if (frame % 6 < 3) {                          // spinning propeller
        ctx.fillRect(x + 17, y + 4, 1, 6);
    } else {
        ctx.fillRect(x + 17, y + 6, 1, 1);
        ctx.fillRect(x + 17, y + 9, 1, 1);
    }
    if (gold) {                                    // golden glow halo
        ctx.fillStyle = 'rgba(255,210,63,0.55)';
        ctx.fillRect(x - 1, y - 1, planeW + 2, 1);
        ctx.fillRect(x - 1, y + planeH, planeW + 2, 1);
    }
}

function drawMarsRocket(x, y, gold) {
    const body = gold ? '#ffe08a' : '#e8e8f0';
    const fin = gold ? '#e8a23a' : '#d33';
    // exhaust flame out the back (left); the rocket flies right, like the plane
    ctx.fillStyle = '#ff9f1c';
    if (frame % 6 < 3) {
        ctx.fillRect(x, y + 5, 3, 3);
    } else {
        ctx.fillRect(x + 1, y + 5, 2, 2);
    }
    // small rear fins (back-left)
    ctx.fillStyle = fin;
    ctx.fillRect(x + 2, y + 2, 2, 3);
    ctx.fillRect(x + 2, y + 8, 2, 3);
    // fuselage
    ctx.fillStyle = body;
    ctx.fillRect(x + 4, y + 5, 10, 3);
    // stripe + window toward the front
    ctx.fillStyle = fin;
    ctx.fillRect(x + 6, y + 6, 3, 1);
    ctx.fillStyle = '#7cd8ff';
    ctx.fillRect(x + 10, y + 6, 2, 1);
    // nose cone pointing right (direction of travel)
    ctx.fillStyle = fin;
    ctx.fillRect(x + 14, y + 5, 3, 3);
    ctx.fillRect(x + 17, y + 5, 1, 1);
    ctx.fillRect(x + 18, y + 6, 1, 1);
    if (gold) {
        ctx.fillStyle = 'rgba(255,210,63,0.55)';
        ctx.fillRect(x - 1, y - 1, planeW + 2, 1);
        ctx.fillRect(x - 1, y + planeH, planeW + 2, 1);
    }
}

function drawSkyline() {
    const mars = currentMap === 'mars';
    const ep = mars ? 0 : smoothPollutionLevel();
    // distant background buildings (slow parallax, hazy silhouette)
    ctx.fillStyle = mars ? '#d8936c' : mixColor('#a9c8ea', '#98a0a8', ep);
    skylineBuildings.forEach(b => {
        const sx = ((b.x - scrollX * 0.35) % SKYLINE_SPAN + SKYLINE_SPAN) % SKYLINE_SPAN;
        [sx - SKYLINE_SPAN, sx, sx + SKYLINE_SPAN].forEach(x => {
            if (x + b.w <= 0 || x >= PIXEL_W) return;
            ctx.fillRect(x, SKYLINE_Y - b.h, b.w, b.h);
        });
    });
    // haze where the city meets the sky
    ctx.fillStyle = mars ? '#e0a47c' : mixColor('#cfe4f7', '#a7adb4', ep);
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
    const ep = currentMap === 'earth' ? smoothPollutionLevel() : 0;
    for (let i = 0; i < count; i++) {
        const tx = Math.round(((i * 41 + 17 - scrollX * 1.6) % PIXEL_W + PIXEL_W) % PIXEL_W);
        const ty = PIXEL_H - 11;
        ctx.fillStyle = '#5c3a1e';
        ctx.fillRect(tx + 1, ty, 2, 3);
        ctx.fillStyle = mixColor(i % 2 ? '#2f7a2f' : '#358335', '#b09b3e', ep);
        ctx.fillRect(tx - 2, ty - 4, 6, 4);
        ctx.fillRect(tx, ty - 6, 2, 2);
    }
}

function drawEarthPollution() {
    if (currentMap !== 'earth') return;
    const ep = Math.max(0, Math.min(1, easedPollution));
    if (ep < 0.01) return;

    // --- LAYER 3: Far smog clouds (small, high, slow drift) ---
    const farCount = Math.round(ep * 4);
    for (let i = 0; i < farCount; i++) {
        const cx = ((i * 73 + 12 - scrollX * 0.25) % (PIXEL_W + 100) + (PIXEL_W + 100)) % (PIXEL_W + 100) - 50;
        const cy = 8 + ((i * 37) % 20);
        ctx.fillStyle = 'rgba(140, 132, 115, ' + (0.2 + ep * 0.3).toFixed(3) + ')';
        ctx.fillRect(cx, cy, 20 + (i % 2) * 8, 3);
        ctx.fillRect(cx + 4, cy - 1, 14 + (i % 2) * 5, 2);
    }

    // --- LAYER 4: Near smog clouds (bigger, lower, faster drift) ---
    const nearCount = Math.round(ep * 5);
    for (let i = 0; i < nearCount; i++) {
        const cx = ((i * 59 + 3 - scrollX * 0.6) % (PIXEL_W + 120) + (PIXEL_W + 120)) % (PIXEL_W + 120) - 60;
        const cy = 20 + ((i * 43) % 28);
        ctx.fillStyle = 'rgba(120, 112, 96, ' + (0.3 + ep * 0.45).toFixed(3) + ')';
        ctx.fillRect(cx, cy, 28 + (i % 3) * 8, 5);
        ctx.fillRect(cx + 3, cy - 2, 20 + (i % 3) * 6, 3);
    }

    // --- LAYER 5: Thick ground-hugging smog ---
    ctx.fillStyle = 'rgba(105, 95, 80, ' + (ep * 0.55).toFixed(3) + ')';
    ctx.fillRect(0, SKYLINE_Y - 10, PIXEL_W, PIXEL_H - SKYLINE_Y + 10);
    ctx.fillStyle = 'rgba(90, 82, 70, ' + (ep * 0.4).toFixed(3) + ')';
    ctx.fillRect(0, SKYLINE_Y - 16, PIXEL_W, 8);

    // --- LAYER 6: Yellow the grass ---
    ctx.fillStyle = 'rgba(165, 148, 58, ' + (ep * 0.45).toFixed(3) + ')';
    ctx.fillRect(0, GROUND_Y, PIXEL_W, PIXEL_H - GROUND_Y);
    ctx.fillStyle = 'rgba(165, 148, 58, ' + (ep * 0.85).toFixed(3) + ')';
    ctx.fillRect(0, PIXEL_H - 12, PIXEL_W, 12);
}

function drawNuclearReactor(x, y, gold) {
    const body = gold ? '#ffe08a' : '#d0d0d8';
    const dark = gold ? '#c8a030' : '#808090';
    // base platform
    ctx.fillStyle = '#606068';
    ctx.fillRect(x - 2, y + planeH + 2, planeW + 4, 3);
    // reactor dome
    ctx.fillStyle = body;
    ctx.fillRect(x + 2, y + 2, 14, 8);
    ctx.fillRect(x + 4, y, 10, 2);
    // control rod / core glow
    ctx.fillStyle = '#44ff88';
    ctx.fillRect(x + 7, y + 4, 4, 3);
    // chimney stacks
    ctx.fillStyle = dark;
    ctx.fillRect(x + 1, y - 6, 3, 8);
    ctx.fillRect(x + 15, y - 4, 3, 6);
    // smoke puffs (animated)
    ctx.fillStyle = 'rgba(180,180,180,0.5)';
    if (frame % 20 < 10) {
        ctx.fillRect(x, y - 10, 4, 3);
        ctx.fillRect(x + 14, y - 8, 5, 3);
    } else {
        ctx.fillRect(x - 1, y - 12, 5, 3);
        ctx.fillRect(x + 13, y - 10, 6, 3);
    }
    // radiation warning symbol
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(x + 8, y + 2, 2, 2);
    if (gold) {
        ctx.fillStyle = 'rgba(255,210,63,0.55)';
        ctx.fillRect(x - 1, y - 1, planeW + 2, 1);
        ctx.fillRect(x - 1, y + planeH, planeW + 2, 1);
    }
}

function drawNuclearScene() {
    const rp = nuclearRiverPollution();
    const riverY = PIXEL_H - 20;
    const riverH = 12;
    // water base — shifts from blue to toxic green
    ctx.fillStyle = mixColor('#3a7aaa', '#4a8a3a', rp);
    ctx.fillRect(0, riverY, PIXEL_W, riverH);
    // shimmer
    ctx.fillStyle = mixColor('#5aa0cc', '#6aaa4a', rp);
    for (let i = 0; i < 8; i++) {
        const sx = ((i * 42 + 5 - scrollX * 0.3) % PIXEL_W + PIXEL_W) % PIXEL_W;
        ctx.fillRect(sx, riverY + 3 + (i % 3) * 2, 10 + (i % 2) * 4, 1);
    }
    // toxic foam at high pollution
    if (rp > 0.3) {
        ctx.fillStyle = 'rgba(120, 180, 60, ' + ((rp - 0.3) * 0.5).toFixed(2) + ')';
        for (let i = 0; i < 6; i++) {
            const fx = ((i * 53 + 11 - scrollX * 0.4) % PIXEL_W + PIXEL_W) % PIXEL_W;
            ctx.fillRect(fx, riverY + 2 + (i % 4) * 2, 6 + (i % 3) * 2, 2);
        }
    }
    // river banks
    ctx.fillStyle = '#4a5a3a';
    ctx.fillRect(0, riverY - 2, PIXEL_W, 2);
    ctx.fillStyle = '#3a4a2a';
    ctx.fillRect(0, riverY + riverH, PIXEL_W, 2);
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

function spawnBoostPlane() {
    nextBoostAt = performance.now() + 180000 + Math.random() * 120000;
    boostPlane = { x: PIXEL_W + 12, y: 18 + Math.random() * 26 };
}

function drawBoostPlane() {
    if (!boostPlane) return;
    const x = Math.round(boostPlane.x);
    const y = Math.round(boostPlane.y + Math.sin(frame * 0.05) * 2);
    ctx.fillStyle = '#22a06b';
    ctx.fillRect(x + 2, y + 3, 10, 3);            // fuselage
    ctx.fillRect(x + 11, y + 4, 3, 1);            // nose
    ctx.fillStyle = '#0d5c3f';
    ctx.fillRect(x + 5, y + 1, 4, 1);             // top wing
    ctx.fillRect(x + 5, y + 6, 4, 1);             // bottom wing
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 3, y + 3, 8, 1);             // stripe
    ctx.fillStyle = '#ffe14d';
    ctx.fillRect(x + 6, y - 6, 1, 4);             // up arrow
    ctx.fillRect(x + 5, y - 5, 3, 1);
}

function drawEffectBadge(cx, y, text, fg, bg, frac) {
    ctx.font = '9px monospace';
    const tw = Math.ceil(ctx.measureText(text).width);
    const w = tw + 8;
    const h = 14;
    const bx = Math.round(cx - w / 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx - 1, y - 1, w + 2, h + 2);
    ctx.fillStyle = bg;
    ctx.fillRect(bx, y, w, h);
    ctx.fillStyle = fg;
    ctx.fillText(text, bx + 4, y + 11);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx, y + h - 1, Math.max(1, Math.round(w * frac)), 1);
}

function drawEffects() {
    const now = performance.now();
    const cx = Math.floor(PIXEL_W / 2);
    let y = 6;
    if (frenzy.active && now < frenzy.endsAt) {
        drawEffectBadge(cx, y, 'GOLDEN PLANE ×' + FRENZY_MULT + ' CLICKS', '#ffd23f', '#7a3c00', (frenzy.endsAt - now) / FRENZY_DURATION);
        y += 16;
    }
    if (boost.active && now < boost.endsAt) {
        drawEffectBadge(cx, y, 'INCOME BOOST ×' + BOOST_MULT, '#8dffc9', '#0b5c3d', (boost.endsAt - now) / BOOST_DURATION);
    }
}

function drawTowerBeacons() {
    if (frame % 10 >= 5) return;
    const layers = getBuildingLayers();
    beaconList.forEach(({ li, b, s, baseY }) => {
        const span = layers[li].width;
        const sx = ((b.x - scrollX * LAYERS[li].speed) % span + span) % span;
        [sx - span, sx, sx + span].forEach(x => {
            if (x + s.w <= 0 || x >= PIXEL_W) return;
            ctx.fillStyle = '#ff5c5c';
            ctx.fillRect(x + Math.floor(s.w / 2) - 2, baseY - s.h + b.yj - 9, 4, 2);
        });
    });
}

function drawScene() {
    // ease pollution toward its target so the visuals shift smoothly
    const pollTarget = currentMap === 'earth' ? earthPollutionLevel() : 0;
    easedPollution += (pollTarget - easedPollution) * 0.04;
    if (Math.abs(pollTarget - easedPollution) < 0.001) easedPollution = pollTarget;
    const ep = Math.max(0, Math.min(1, easedPollution));
    // sky — shifts from blue to dirty brown-gray with pollution
    if (currentMap === 'mars') {
        ctx.fillStyle = '#c98a5b';
        ctx.fillRect(0, 0, PIXEL_W, SKYLINE_Y);
    } else if (currentMap === 'nuclear') {
        ctx.fillStyle = mixColor('#7a8a7a', '#4a5a4a', ep * 0.8);
        ctx.fillRect(0, 0, PIXEL_W, SKYLINE_Y);
    } else {
        const skyTop = mixColor('#9ad0ff', '#6e6558', ep * 0.7);
        const skyBot = mixColor('#b8d8f8', '#7a6e5a', ep * 0.85);
        const grad = ctx.createLinearGradient(0, 0, 0, SKYLINE_Y);
        grad.addColorStop(0, skyTop);
        grad.addColorStop(1, skyBot);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, PIXEL_W, SKYLINE_Y);

        // dimming sun, drawn behind the skyline and clouds
        if (ep > 0.05) {
            const sunX = 50, sunY = 18;
            const sunAlpha = Math.max(0.08, 0.5 - ep * 0.45);
            const sunColor = mixColor('#ffe87a', '#d4943a', ep);
            ctx.fillStyle = sunColor;
            ctx.globalAlpha = sunAlpha;
            const r = Math.round(6 - ep * 2);
            for (let dy = -r; dy <= r; dy++) {
                for (let dx = -r; dx <= r; dx++) {
                    if (dx * dx + dy * dy <= r * r) ctx.fillRect(sunX + dx, sunY + dy, 1, 1);
                }
            }
            ctx.globalAlpha = 1;
        }
    }

    // background city + haze (behind everything else)
    drawSkyline();

    // clouds + birds
    if (currentMap === 'earth' || currentMap === 'nuclear') {
        ctx.fillStyle = '#ffffff';
        clouds.forEach(c => {
            const span = PIXEL_W + 40;
            const cx = ((c.x - scrollX * 0.4) % span + span) % span - 20;
            ctx.fillRect(cx, c.y, c.w, 4);
        });
        drawBirds();
    }

    // ground plane from the horizon down
    if (currentMap === 'mars') {
        ctx.fillStyle = '#a3442e';
    } else if (currentMap === 'nuclear') {
        ctx.fillStyle = '#5a6a5a';
    } else {
        ctx.fillStyle = '#3f9b3f';
    }
    ctx.fillRect(0, SKYLINE_Y, PIXEL_W, PIXEL_H - SKYLINE_Y);
    if (currentMap === 'mars') {
        ctx.fillStyle = '#8c3a28';
    } else if (currentMap === 'nuclear') {
        ctx.fillStyle = '#4a5a4a';
    } else {
        ctx.fillStyle = '#358335';
    }
    ctx.fillRect(0, SKYLINE_Y, PIXEL_W, 2);

    // scrolling grass tufts
    if (currentMap === 'earth' || currentMap === 'nuclear') {
        ctx.fillStyle = '#2f7a2f';
        for (let i = 0; i < 8; i++) {
            const gx = ((i * 45 - scrollX) % PIXEL_W + PIXEL_W) % PIXEL_W;
            ctx.fillRect(gx, GROUND_Y + 5, 2, 4);
        }
    }

    // player's buildings, layered back-to-front for natural depth.
    // Each layer is pre-rendered into fixed-width tiles, so drawing a city
    // with thousands of buildings costs a handful of drawImage blits instead
    // of one fillRect-heavy pass per building per frame.
    ensureTiles();
    const buildingLayers = getBuildingLayers();
    for (let li = LAYERS.length - 1; li >= 0; li--) {
        const span = buildingLayers[li].width;
        const sx0 = ((-(scrollX * LAYERS[li].speed)) % span + span) % span;
        layerTiles[li].forEach(tile => {
            [sx0 - span, sx0, sx0 + span].forEach(off => {
                const x = off + tile.x;
                if (x + tile.canvas.width <= 0 || x >= PIXEL_W) return;
                ctx.drawImage(tile.canvas, Math.round(x), 0);
            });
        });
    }
    drawTowerBeacons();
    drawEarthPollution();

    // foreground strip
    if (currentMap === 'mars') {
        ctx.fillStyle = '#7a2f1f';
        ctx.fillRect(0, PIXEL_H - 12, PIXEL_W, 12);
        ctx.fillStyle = '#5c2317';
        for (let i = 0; i < 12; i++) {
            const gx = ((i * 33 - scrollX * 1.6) % PIXEL_W + PIXEL_W) % PIXEL_W;
            ctx.fillRect(gx, PIXEL_H - 8, 3, 8);
        }
    } else if (currentMap === 'nuclear') {
        drawNuclearScene();
    } else {
        ctx.fillStyle = mixColor('#2c6e34', '#8a7a2a', ep);
        ctx.fillRect(0, PIXEL_H - 12, PIXEL_W, 12);
        ctx.fillStyle = mixColor('#1f5227', '#6b5c1e', ep);
        for (let i = 0; i < 12; i++) {
            const gx = ((i * 33 - scrollX * 1.6) % PIXEL_W + PIXEL_W) % PIXEL_W;
            ctx.fillRect(gx, PIXEL_H - 8, 3, 8);
        }
    }

    // trees: the bigger your city, the more greenery fills the foreground
    if (currentMap === 'earth' || currentMap === 'nuclear') {
        const totalOwned = state.buildings.reduce((a, b) => a + b, 0);
        drawTrees(Math.min(10, Math.floor(totalOwned / 10)));
    }

    // clickable ship centered, bobbing (rocket on Mars, plane on Earth)
    planeX = Math.floor(PIXEL_W / 2 - planeW / 2);
    planeY = 46 + Math.round(Math.sin(frame * 0.04) * 4);
    if (currentMap === 'mars') drawMarsRocket(planeX, planeY, frenzyActive());
    else if (currentMap === 'nuclear') drawNuclearReactor(planeX, planeY, frenzyActive());
    else drawPlane(planeX, planeY, frenzyActive());
    drawClickHint();
    drawCombo();
    drawBalloon();
    drawBoostPlane();
    drawEffects();

    // floating +$ text (crits, balloon payouts, and boosts are bigger + tinted)
    floaters.forEach(f => {
        const big = !!f.crit || !!f.gold;
        const fontPx = big ? 10 : 9;
        ctx.font = fontPx + 'px monospace';
        const tw = Math.ceil(ctx.measureText(f.text).width);
        // Round to whole pixels so scaled-up text stays crisp, not blurry
        const tx = Math.round(f.x);
        const ty = Math.round(f.y);
        const w = tw + 8;
        const h = fontPx + 4;
        ctx.fillStyle = f.gold ? 'rgba(10, 80, 44, 0.92)' : (big ? 'rgba(130, 20, 20, 0.9)' : 'rgba(0, 0, 0, 0.78)');
        ctx.fillRect(tx, ty, w, h);
        ctx.fillStyle = f.gold ? '#8dffc9' : (big ? '#ffd23f' : '#ffffff');
        ctx.fillText(f.text, tx + 4, ty + fontPx + 1);
    });
}

function animate() {
    frame++;
    scrollX += 1.2;

    const now = performance.now();

    // Golden Plane frenzy event
    if (frenzy.active && now >= frenzy.endsAt) {
        frenzy.active = false;
        frenzy.nextAt = now + 75000 + Math.random() * 45000;
    }
    if (!frenzy.active && now >= frenzy.nextAt) {
        frenzy.active = true;
        frenzy.endsAt = now + FRENZY_DURATION;
        state.frenziesTriggered++;
        showToast('✨ Golden Plane! Clicks ×' + FRENZY_MULT + ' for ' + Math.round(FRENZY_DURATION / 1000) + 's');
    }

    // income boost plane event
    if (boost.active && now >= boost.endsAt) {
        boost.active = false;
        nextBoostAt = now + 180000 + Math.random() * 120000;
    }
    if (!boostPlane && !boost.active && now >= nextBoostAt) spawnBoostPlane();
    if (boostPlane) {
        boostPlane.x -= 0.8;
        if (boostPlane.x < -20) boostPlane = null;
    }

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

    if (boostPlane) {
        const bx = Math.round(boostPlane.x);
        const by = Math.round(boostPlane.y + Math.sin(frame * 0.05) * 2);
        if (px >= bx - 2 && px <= bx + 14 && py >= by - 6 && py <= by + 8) {
            boost.active = true;
            boost.endsAt = performance.now() + BOOST_DURATION;
            state.boostsCaught++;
            floaters.push({ x: bx, y: by, text: 'BOOST ×' + BOOST_MULT + ' income!', gold: true, life: 55 });
            boostPlane = null;
            update();
            showToast('📈 Income boost! ×' + BOOST_MULT + ' income for ' + Math.round(BOOST_DURATION / 1000) + 's');
            return;
        }
    }

    if (px >= planeX && px <= planeX + planeW && py >= planeY - planeHitPad && py <= planeY + planeH + planeHitPad) {
        clickPlane();
    }
});

// ---- shop + reset + save settings ----
shopToggle.onclick = openShop;
shopClose.onclick = closeShop;
shopBackdrop.onclick = closeShop;
rebirthBtn.onclick = doRebirth;
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
    state = { money: 0, clickPower: 1, clickLevel: 0, buildings: buildings.concat(nuclearBuildings).map(() => 0), totalClicks: 0, totalEarned: 0, achievements: [], balloonsCaught: 0, rebirths: 0, bestCombo: 0, frenziesTriggered: 0, boostsCaught: 0, lastSaved: 0 };
    combo = 0;
    comboEndsAt = 0;
    frenzy.active = false;
    boost.active = false;
    boostPlane = null;
    invalidateLayers();
    metaSig = '';
    save();
    update();
};

function save() {
    state.lastSaved = Date.now();
    localStorage.setItem(SAVE_KEY, encodeSave(state));
}
function loadFrom(data) {
    state.money = data.money ?? 0;
    state.clickPower = data.clickPower ?? 1;
    state.clickLevel = data.clickLevel ?? 0;
    state.buildings = data.buildings ?? buildings.map(() => 0);
    while (state.buildings.length < buildings.length + nuclearBuildings.length) state.buildings.push(0);
    state.buildings.length = buildings.length + nuclearBuildings.length;
    state.totalClicks = data.totalClicks ?? 0;
    state.totalEarned = data.totalEarned ?? 0;
    state.achievements = Array.isArray(data.achievements) ? data.achievements : [];
    state.balloonsCaught = data.balloonsCaught ?? 0;
    state.rebirths = data.rebirths ?? 0;
    state.bestCombo = data.bestCombo ?? 0;
    state.frenziesTriggered = data.frenziesTriggered ?? 0;
    state.boostsCaught = data.boostsCaught ?? 0;
    state.lastSaved = data.lastSaved ?? 0;
    invalidateLayers();
}
function load() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const data = decodeSave(raw);
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
