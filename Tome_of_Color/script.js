const minTiles = 2;
const maxTiles = 10;
let tileCount = 5;

const paletteContainer = document.querySelector('.palette-container');
const decreaseBtn = document.getElementById('decreaseTiles');
const increaseBtn = document.getElementById('increaseTiles');
const generateBtn = document.getElementById('generateBtn');
const exportBtn = document.getElementById('exportBtn');
const tileCountLabel = document.getElementById('tileCount');

function generateRandomColor() {
    const value = Math.floor(Math.random() * 16777215).toString(16);
    return `#${value.padStart(6, '0')}`;
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function createTile() {
    const tile = document.createElement('div');
    tile.className = 'color-bar';
    tile.dataset.locked = 'false';

    const actions = document.createElement('div');
    actions.className = 'tile-actions';

    const lockButton = document.createElement('button');
    lockButton.type = 'button';
    lockButton.className = 'tile-btn lock-btn';
    lockButton.textContent = '🔓';
    lockButton.addEventListener('click', () => toggleTileLock(tile, lockButton));

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'tile-btn copy-btn';
    copyButton.textContent = 'Copy HEX';
    copyButton.addEventListener('click', () => copyTileHex(tile));

    actions.append(lockButton, copyButton);

    const hexSpan = document.createElement('span');
    hexSpan.className = 'value hex';
    hexSpan.dataset.type = 'hex';
    hexSpan.textContent = '#000000';

    const rgbSpan = document.createElement('span');
    rgbSpan.className = 'value rgb';
    rgbSpan.dataset.type = 'rgb';
    rgbSpan.textContent = 'rgb(0, 0, 0)';

    const hslSpan = document.createElement('span');
    hslSpan.className = 'value hsl';
    hslSpan.dataset.type = 'hsl';
    hslSpan.textContent = 'hsl(0, 0%, 0%)';

    tile.append(actions, hexSpan, rgbSpan, hslSpan);
    return tile;
}

function toggleTileLock(tile, button) {
    const locked = tile.dataset.locked === 'true';
    tile.dataset.locked = locked ? 'false' : 'true';
    tile.classList.toggle('locked', !locked);
    button.textContent = locked ? '🔓' : '🔒';
}

function copyTileHex(tile) {
    const hex = tile.querySelector('[data-type="hex"]').textContent;
    navigator.clipboard.writeText(hex).then(() => {
        alert(`Copied ${hex}`);
    }).catch(() => {
        alert('Copy failed.');
    });
}

function updateTileValues(tile, hex) {
    tile.style.backgroundColor = hex;

    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    tile.querySelector('[data-type="hex"]').textContent = hex.toUpperCase();
    tile.querySelector('[data-type="rgb"]').textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    tile.querySelector('[data-type="hsl"]').textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function renderTiles() {
    paletteContainer.innerHTML = '';

    for (let i = 0; i < tileCount; i += 1) {
        paletteContainer.appendChild(createTile());
    }

    generatePalette();
    updateAdjusterButtons();
}

function generatePalette() {
    const tiles = paletteContainer.querySelectorAll('.color-bar');
    tiles.forEach(tile => {
        if (tile.dataset.locked === 'true') {
            return;
        }

        const hex = generateRandomColor();
        updateTileValues(tile, hex);
    });
}

function updateAdjusterButtons() {
    decreaseBtn.disabled = tileCount <= minTiles;
    increaseBtn.disabled = tileCount >= maxTiles;
    tileCountLabel.textContent = tileCount;
}

function changeTileCount(amount) {
    tileCount = Math.min(maxTiles, Math.max(minTiles, tileCount + amount));
    renderTiles();
}

function exportPalette() {
    const tiles = paletteContainer.querySelectorAll('.color-bar');
    const colors = Array.from(tiles).map(tile => ({
        hex: tile.querySelector('[data-type="hex"]').textContent,
        rgb: tile.querySelector('[data-type="rgb"]').textContent,
        hsl: tile.querySelector('[data-type="hsl"]').textContent,
        locked: tile.dataset.locked === 'true'
    }));

    const json = JSON.stringify(colors, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'palette.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function handleKeyboard(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        generatePalette();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderTiles();

    decreaseBtn.addEventListener('click', () => changeTileCount(-1));
    increaseBtn.addEventListener('click', () => changeTileCount(1));
    generateBtn.addEventListener('click', generatePalette);
    exportBtn.addEventListener('click', exportPalette);
    document.addEventListener('keydown', handleKeyboard);
});
