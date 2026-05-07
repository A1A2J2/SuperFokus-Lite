import { ipcRenderer } from '../utils/ipc.js';
import { store } from '../utils/storage.js';

// --- Theme & Setup ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleModalBtn = document.getElementById('theme-toggle-modal');
const headerDarkModeToggleCheckbox = document.getElementById('toggle-header-dark-mode');

// Modal Elements
const themeRadioLight = document.getElementById('theme-radio-light');
const themeRadioDark = document.getElementById('theme-radio-dark');
const themeRadioCustom = document.getElementById('theme-radio-custom');
const customThemeOptions = document.getElementById('custom-theme-options');

// Custom Theme Colors
const customMainColor = document.getElementById('custom-main-color');
const customAccentColor = document.getElementById('custom-accent-color');
const customHeaderTitleColor = document.getElementById('custom-header-title-color');
const customH1Color = document.getElementById('custom-h1-color');
const customH2Color = document.getElementById('custom-h2-color');
const customH3Color = document.getElementById('custom-h3-color');
const customTextColor = document.getElementById('custom-text-color');
const customBg1Color = document.getElementById('custom-bg1-color');
const customBg1GradColor = document.getElementById('custom-bg1-grad-color');
const customBg2Color = document.getElementById('custom-bg2-color');
const resetThemeColorsBtn = document.getElementById('reset-theme-colors-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

let currentThemeMode = 'light'; // 'light', 'dark', or 'custom'
let showHeaderDarkModeToggle = store.get('showHeaderDarkModeToggle', true);

const modeLabels = {
    'light': '☀️ Light Mode',
    'dark': '🌙 Dark Mode',
    'custom': '🖌️ Custom Theme'
};

const modeNames = {
    'light': 'Light Mode',
    'dark': 'Dark Mode',
    'custom': 'Custom Theme'
};

export function initTheme() {
    currentThemeMode = store.get('themeMode', 'light');
    showHeaderDarkModeToggle = store.get('showHeaderDarkModeToggle', true);

    // Set initial radio state
    if (themeRadioLight && currentThemeMode === 'light') themeRadioLight.checked = true;
    if (themeRadioDark && currentThemeMode === 'dark') themeRadioDark.checked = true;
    if (themeRadioCustom && currentThemeMode === 'custom') themeRadioCustom.checked = true;

    const savedMain = store.get('customMainColor', null);
    const savedAccent = store.get('customAccentColor', null);
    const savedHeaderTitle = store.get('customHeaderTitleColor', null);
    const savedH1 = store.get('customH1Color', null);
    const savedH2 = store.get('customH2Color', null);
    const savedH3 = store.get('customH3Color', null);
    const savedText = store.get('customTextColor', null);
    const savedBg1 = store.get('customBg1Color', null);
    const savedBg1Grad = store.get('customBg1GradColor', null);
    const savedBg2 = store.get('customBg2Color', null);
    
    if (savedMain && customMainColor) customMainColor.value = savedMain;
    if (savedAccent && customAccentColor) customAccentColor.value = savedAccent;
    if (savedHeaderTitle && customHeaderTitleColor) customHeaderTitleColor.value = savedHeaderTitle;
    if (savedH1 && customH1Color) customH1Color.value = savedH1;
    if (savedH2 && customH2Color) customH2Color.value = savedH2;
    if (savedH3 && customH3Color) customH3Color.value = savedH3;
    if (savedText && customTextColor) customTextColor.value = savedText;
    if (savedBg1 && customBg1Color) customBg1Color.value = savedBg1;
    if (savedBg1Grad && customBg1GradColor) customBg1GradColor.value = savedBg1Grad;
    if (savedBg2 && customBg2Color) customBg2Color.value = savedBg2;

    initializeCustomizationTabs();
    applyTheme();
    applyHeaderToggleVisibility();
}

function initializeCustomizationTabs() {
    if (!tabButtons || !tabContents) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            if (!tabId) return;

            tabButtons.forEach(btn => btn.classList.toggle('active', btn === button));
            tabContents.forEach(content => {
                const isTarget = content.id === tabId;
                content.style.display = isTarget ? 'block' : 'none';
                content.classList.toggle('active', isTarget);
            });
        });
    });
}

function updateHeaderToggleButtonText() {
    if (!themeToggleBtn) return;
    
    let targetState = 'dark';
    if (currentThemeMode === 'dark') {
        targetState = 'light';
    } else if (currentThemeMode !== 'light' && currentThemeMode !== 'dark') {
        targetState = 'light';
    }

    themeToggleBtn.innerText = modeLabels[targetState] || 'Toggle Mode';
}

function applyTheme() {
    const savedMain = customMainColor ? customMainColor.value : '#6a11cb';
    const savedAccent = customAccentColor ? customAccentColor.value : '#2575fc';
    const savedHeaderTitle = customHeaderTitleColor ? customHeaderTitleColor.value : '#ffffff';
    const savedH1 = customH1Color ? customH1Color.value : '#2c3e50';
    const savedH2 = customH2Color ? customH2Color.value : '#2c3e50';
    const savedH3 = customH3Color ? customH3Color.value : '#2c3e50';
    const savedText = customTextColor ? customTextColor.value : '#4a4a4a';
    const savedBg1 = customBg1Color ? customBg1Color.value : '#f5f7fa';
    const savedBg1Grad = customBg1GradColor ? customBg1GradColor.value : '#c3cfe2';
    const savedBg2 = customBg2Color ? customBg2Color.value : '#ffffff';

    // Reset standard styles
    document.documentElement.style.removeProperty('--header-grad-1');
    document.documentElement.style.removeProperty('--header-grad-2');
    document.documentElement.style.removeProperty('--header-title-color');
    document.documentElement.style.removeProperty('--h1-color');
    document.documentElement.style.removeProperty('--h2-color');
    document.documentElement.style.removeProperty('--h3-color');
    document.documentElement.style.removeProperty('--text-color');
    document.documentElement.style.removeProperty('--bg-grad-1');
    document.documentElement.style.removeProperty('--bg-grad-2');
    document.documentElement.style.removeProperty('--container-bg');
    document.body.classList.remove('dark-mode');

    // UI state for Custom section
    if (customThemeOptions) {
        if (currentThemeMode === 'custom') {
            customThemeOptions.style.opacity = '1';
            customThemeOptions.style.pointerEvents = 'auto';
        } else {
            customThemeOptions.style.opacity = '0.5';
            customThemeOptions.style.pointerEvents = 'none';
        }
    }

    if (currentThemeMode === 'dark') {
        document.body.classList.add('dark-mode');
        ipcRenderer.send('theme-changed', true);
    } else if (currentThemeMode === 'light') {
        ipcRenderer.send('theme-changed', false);
    } else if (currentThemeMode === 'custom') {
        document.documentElement.style.setProperty('--header-grad-1', savedMain);
        document.documentElement.style.setProperty('--header-grad-2', savedAccent);
        document.documentElement.style.setProperty('--header-title-color', savedHeaderTitle);
        document.documentElement.style.setProperty('--h1-color', savedH1);
        document.documentElement.style.setProperty('--h2-color', savedH2);
        document.documentElement.style.setProperty('--h3-color', savedH3);
        document.documentElement.style.setProperty('--text-color', savedText);
        document.documentElement.style.setProperty('--bg-grad-1', savedBg1);
        document.documentElement.style.setProperty('--bg-grad-2', savedBg1Grad);
        document.documentElement.style.setProperty('--container-bg', savedBg2);
        ipcRenderer.send('theme-changed', false);
    }

    updateHeaderToggleButtonText();
}

function applyHeaderToggleVisibility() {
    if (themeToggleBtn) {
        themeToggleBtn.style.display = showHeaderDarkModeToggle ? 'block' : 'none';
    }
    if (headerDarkModeToggleCheckbox) {
        headerDarkModeToggleCheckbox.checked = showHeaderDarkModeToggle;
    }
}

function setThemeMode(mode) {
    currentThemeMode = mode;
    store.set('themeMode', currentThemeMode);
    
    if (mode === 'dark' || mode === 'light') {
         store.set('darkMode', mode === 'dark'); 
    }

    if (themeRadioLight) themeRadioLight.checked = (mode === 'light');
    if (themeRadioDark) themeRadioDark.checked = (mode === 'dark');
    if (themeRadioCustom) themeRadioCustom.checked = (mode === 'custom');

    applyTheme();
}

// Header Toggle (Quick Switch)
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        let targetState = 'dark';
        if (currentThemeMode === 'dark') {
            targetState = 'light';
        } else if (currentThemeMode !== 'light' && currentThemeMode !== 'dark') {
            targetState = 'light';
        }
        setThemeMode(targetState);
    });
}

if (themeToggleModalBtn) themeToggleModalBtn.addEventListener('click', toggleTheme);

// Modal Radio Buttons
if (themeRadioLight) themeRadioLight.addEventListener('change', () => setThemeMode('light'));
if (themeRadioDark) themeRadioDark.addEventListener('change', () => setThemeMode('dark'));
if (themeRadioCustom) themeRadioCustom.addEventListener('change', () => setThemeMode('custom'));

// Custom Theme Pickers
const applyColorChange = () => { if (currentThemeMode === 'custom') applyTheme(); };

if (customMainColor) customMainColor.addEventListener('input', (e) => { store.set('customMainColor', e.target.value); applyColorChange(); });
if (customAccentColor) customAccentColor.addEventListener('input', (e) => { store.set('customAccentColor', e.target.value); applyColorChange(); });
if (customHeaderTitleColor) customHeaderTitleColor.addEventListener('input', (e) => { store.set('customHeaderTitleColor', e.target.value); applyColorChange(); });
if (customH1Color) customH1Color.addEventListener('input', (e) => { store.set('customH1Color', e.target.value); applyColorChange(); });
if (customH2Color) customH2Color.addEventListener('input', (e) => { store.set('customH2Color', e.target.value); applyColorChange(); });
if (customH3Color) customH3Color.addEventListener('input', (e) => { store.set('customH3Color', e.target.value); applyColorChange(); });
if (customTextColor) customTextColor.addEventListener('input', (e) => { store.set('customTextColor', e.target.value); applyColorChange(); });
if (customBg1Color) customBg1Color.addEventListener('input', (e) => { store.set('customBg1Color', e.target.value); applyColorChange(); });
if (customBg1GradColor) customBg1GradColor.addEventListener('input', (e) => { store.set('customBg1GradColor', e.target.value); applyColorChange(); });
if (customBg2Color) customBg2Color.addEventListener('input', (e) => { store.set('customBg2Color', e.target.value); applyColorChange(); });

if (resetThemeColorsBtn) {
    resetThemeColorsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to revert back to the default custom colors?')) {
            store.delete('customMainColor');
            store.delete('customAccentColor');
            store.delete('customHeaderTitleColor');
            store.delete('customH1Color');
            store.delete('customH2Color');
            store.delete('customH3Color');
            store.delete('customTextColor');
            store.delete('customBg1Color');
            store.delete('customBg1GradColor');
            store.delete('customBg2Color');

            if (customMainColor) customMainColor.value = '#6a11cb';
            if (customAccentColor) customAccentColor.value = '#2575fc';
            if (customHeaderTitleColor) customHeaderTitleColor.value = '#ffffff';
            if (customH1Color) customH1Color.value = '#2c3e50';
            if (customH2Color) customH2Color.value = '#2c3e50';
            if (customH3Color) customH3Color.value = '#2c3e50';
            if (customTextColor) customTextColor.value = '#4a4a4a';
            if (customBg1Color) customBg1Color.value = '#f5f7fa';
            if (customBg1GradColor) customBg1GradColor.value = '#c3cfe2';
            if (customBg2Color) customBg2Color.value = '#ffffff';
            applyColorChange();
        }
    });
}

if (headerDarkModeToggleCheckbox) {
    headerDarkModeToggleCheckbox.addEventListener('change', (e) => {
        showHeaderDarkModeToggle = e.target.checked;
        store.set('showHeaderDarkModeToggle', showHeaderDarkModeToggle);
        applyHeaderToggleVisibility();
    });
}

function toggleTheme() {
    let targetState = 'dark';
    if (currentThemeMode === 'dark') {
        targetState = 'light';
    } else if (currentThemeMode !== 'light' && currentThemeMode !== 'dark') {
        targetState = 'light';
    }
    setThemeMode(targetState);
}

export { toggleTheme, applyTheme, applyHeaderToggleVisibility };