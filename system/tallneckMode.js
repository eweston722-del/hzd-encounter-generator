/*
 * Dieses Programm ist freie Software: Sie können es unter den Bedingungen
 * der GNU General Public License, wie von der Free Software Foundation,
 * Version 3 der Lizenz oder (nach Ihrer Wahl) jeder späteren Version,
 * weiterverbreiten und/oder modifizieren.
 *
 * Dieses Programm wird in der Hoffnung verteilt, dass es nützlich sein wird,
 * jedoch OHNE JEDE GEWÄHRLEISTUNG; sogar ohne die implizite Gewährleistung
 * der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
 * Siehe die GNU General Public License für weitere Details.
 *
 * Eine Kopie der GNU General Public License sollten Sie zusammen mit
 * diesem Programm erhalten haben. Falls nicht, siehe <https://www.gnu.org/licenses/>.
 *
 * Copyright (C) 2025 F.G. Schubert
 */
/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * Copyright (C) 2025 F.G. Schubert
 */

const hash = window.location.hash.substring(1);
const data = JSON.parse(LZString.decompressFromEncodedURIComponent(hash));

const placedTileList = data.placedTileList;
const tileSpawnPoints = data.tileSpawnPoints;
const machines = data.machines;
const machineDefinitions = data.machineDefinitions;

/*function getSpawnPointsForTile(tileId) {
    return tileSpawnPoints
        .filter(t => t.id === tileId)
        .map(t => t.spawnPoint);
}*/
function getSpawnTypeForTile(tileId) {
    const entry = tileSpawnPoints.find(t => t.id === tileId);
    return entry ? entry.spawnPoint : "-";
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandomMachine() {
    return machines[Math.floor(Math.random() * machines.length)];
}

/*function generateMachines() {
    const count = randomInt(2, 3);
    const result = {};

    for (let i = 0; i < count; i++) {
        const m = pickRandomMachine();
        result[m] = (result[m] || 0) + 1;
    }

    return Object.entries(result)
        .map(([m, c]) => `${c}x ${m}`)
        .join(", ");
}*/
function generateMachinesForTile() {
    const count = Math.floor(Math.random() * 2) + 2; // 2 oder 3
    const local = {};
    let tries = 0;

    while (Object.values(local).reduce((a,b)=>a+b,0) < count && tries < 50) {
        const candidates = Object.entries(machinePool)
            .filter(([_, m]) => m.remaining > 0)
            .filter(([_, m]) => m.shared === "x" || !usedSharedMiniatures.has(m.shared));

        if (candidates.length === 0) break;

        const [name, data] = candidates[Math.floor(Math.random() * candidates.length)];

        local[name] = (local[name] || 0) + 1;
        data.remaining--;

        if (data.shared !== "x") {
            usedSharedMiniatures.add(data.shared);
        }

        tries++;
    }

    return Object.entries(local)
        .map(([m,c]) => `${c}x ${m}`)
        .join(", ");
}

/*function parseMachineDefinitions() {
  let parsedMachines = [];

  for (const def of machineDefinitions) {
    let [name, lvl, diff, shared, levelsStr] = def.split(".");
    let levels = [];

    if (levelsStr && levelsStr.includes(":")) {
      let parts = levelsStr.split(":");
      if (parts[1]) {
        levels = parts[1].split(";").map(p => {
          let nums = p.replace(/[()]/g, "").split(",");
          return {
            primary: parseInt(nums[0] || "0"),
            secondary: parseInt(nums[1] || "0")
          };
        });
      }
    }

    // Fallback: falls Levels fehlen → fülle mit Nullen auf (für 5 Encounter-Level)
    while (levels.length < 5) {
      levels.push({ primary: 0, secondary: 0 });
    }

    parsedMachines.push({
        name,
        baseDifficulty: parseFloat(diff),
        shared: shared || "x",
        levels
    });
  }

  return parsedMachines;
}*/
function parseMachineDefinitions() {
  let parsedMachines = [];

  for (const def of machineDefinitions) {

    // watcher.4.1.w:(...)
    const [left, levelsPart] = def.split(":");
    const [name, lvl, diff, shared] = left.split(".");

    let levels = [];

    if (levelsPart) {
      levels = levelsPart.split(";").map(p => {
        const nums = p.replace(/[()]/g, "").split(",");
        return {
          primary: parseInt(nums[0] || "0", 10),
          secondary: parseInt(nums[1] || "0", 10)
        };
      });
    }

    while (levels.length < 5) {
      levels.push({ primary: 0, secondary: 0 });
    }

    parsedMachines.push({
      name,
      baseDifficulty: parseFloat(diff),
      shared: shared || "x",
      levels
    });
  }

  return parsedMachines;
}

//const table = document.getElementById("tallneckTable");

const parsedMachines = parseMachineDefinitions();
const ENCOUNTER_LEVEL = 3; // oder aus Brief ableiten

const machinePool = {};
const usedSharedMiniatures = new Set();

parsedMachines.forEach(m => {
    const limit = m.levels[ENCOUNTER_LEVEL - 1].primary;
    if (limit > 0) {
        machinePool[m.name] = {
            remaining: limit,
            shared: m.shared || "x"
        };
    }
});


/*document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("boardCanvas");
    const ctx = canvas.getContext("2d");

    renderTallneckBoard();
});

function renderTallneckBoard() {
    // Bounding Box des Boards bestimmen
    const xs = placedTileList.map(t => t.x);
    const ys = placedTileList.map(t => t.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const boardWidth = (maxX - minX + 1);
    const boardHeight = (maxY - minY + 1);

    const tileSize = Math.min(
        canvas.width / boardWidth,
        canvas.height / boardHeight
    );

    const offsetX = (canvas.width - boardWidth * tileSize) / 2 - minX * tileSize;
    const offsetY = (canvas.height - boardHeight * tileSize) / 2 - minY * tileSize;

    drawBoard(placedTileList, ctx, {
        tileSize,
        offsetX,
        offsetY
    });
}*/

let tileSize = 100;     // oder kleiner, wenn nötig
let third = tileSize / 3;

function renderTallneckBoard() {
    const board = document.getElementById("tallneckBoard");
    board.innerHTML = "";

    // Bounding Box bestimmen
    const xs = placedTileList.map(t => t.x);
    const ys = placedTileList.map(t => t.y);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);

    placedTileList.forEach(entry => {
        const tile = entry.tile;
        const rotation = entry.rot;

        const leftPx = entry.x - minX;
        const topPx = entry.y - minY;

        const tileDiv = entry.isStartingTile
            ? createStartingTileElement(tile, rotation, leftPx, topPx)
            : createTileElement(tile, rotation, leftPx, topPx);

        board.appendChild(tileDiv);
    });
}

/*function renderBoardFromPlacedTiles({
  placedTileList,
  tileWrapper,
  outputElement,
  tileSizeValue
}) {
  // Reset
  tileWrapper.innerHTML = "";
  tileWrapper.style.transform = "none";
  tileWrapper.style.left = "0px";
  tileWrapper.style.top = "0px";

  // Tallneck-spezifische Globals setzen
  tileSize = tileSizeValue;
  third = tileSize / 3;

  // Tiles zeichnen
  for (const entry of placedTileList) {
    const tileDiv = entry.isStartingTile
      ? createStartingTileElement(entry.tile, entry.rot, entry.x, entry.y)
      : createTileElement(entry.tile, entry.rot, entry.x, entry.y);

    tileWrapper.appendChild(tileDiv);
  }

  // Normalisieren (zentrieren + skalieren)
  requestAnimationFrame(() => {
    normalizeTilesToOutput(tileWrapper, outputElement);
  });
}*/
function renderBoardFromPlacedTiles({
  placedTileList,
  tileWrapper,
  outputElement,
  tileSizeValue
}) {
  tileWrapper.innerHTML = "";
  tileWrapper.style.transform = "none";
  tileWrapper.style.left = "0px";
  tileWrapper.style.top = "0px";

  // Tallneck-spezifische Tile-Größe
  tileSize = tileSizeValue;
  third = tileSize / 3;

  // 🔑 1. Bounding Box in GRID-KOORDINATEN bestimmen
  const xs = placedTileList.map(e => e.x);
  const ys = placedTileList.map(e => e.y);

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  // 🔑 2. Tiles RELATIV zeichnen
  for (const entry of placedTileList) {
    const relX = entry.x - minX;
    const relY = entry.y - minY;

    const tileDiv = entry.isStartingTile
      ? createStartingTileElement(entry.tile, entry.rot, relX, relY)
      : createTileElement(entry.tile, entry.rot, relX, relY);

    tileWrapper.appendChild(tileDiv);
  }

  // 🔑 3. Danach erst visuell normalisieren
  requestAnimationFrame(() => {
    normalizeTilesToOutput(tileWrapper, outputElement);
  });
}

function normalizeTilesToOutput(tileWrapper, output) {
  tileWrapper.style.transform = "none";

  const tiles = [...tileWrapper.children];
  if (tiles.length === 0) return;

  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  tiles.forEach(tile => {
    const x = tile.offsetLeft;
    const y = tile.offsetTop;
    const w = tile.offsetWidth;
    const h = tile.offsetHeight;

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
  });

  const contentWidth  = maxX - minX;
  const contentHeight = maxY - minY;
  if (contentWidth <= 0 || contentHeight <= 0) return;

  const padding = 20;
  const outputRect = output.getBoundingClientRect();

  const scale = Math.min(
    (outputRect.width  - padding * 2) / contentWidth,
    (outputRect.height - padding * 2) / contentHeight
  );

  const translateX =
    (outputRect.width  - contentWidth  * scale) / 2 - minX * scale;
  const translateY =
    (outputRect.height - contentHeight * scale) / 2 - minY * scale;

  tileWrapper.style.transform =
    `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function createTileElement(tile, rotation, leftPx, topPx) {
    const div = document.createElement("div");
    div.className = "tile";
    div.style.position = "absolute";
    div.style.left = `${leftPx*third}px`;
    div.style.top = `${topPx*third}px`;

    div.style.width = tileSize + "px";
    div.style.height = tileSize + "px";

    const img = document.createElement("img");
    img.src = "system/resources/standard tile_standard.jpg";
    img.style.transform = `rotate(${rotation*90}deg)`;

    const debug = document.createElement("div");
    debug.className = "debug";
    debug.textContent = tile.id + ` ⟳${rotation*90}°`;

    const tileName = document.createElement("div");
    tileName.className = "tileName";
    tileName.textContent = tile.id;
        
    div.appendChild(img);
    //div.appendChild(debug);
    div.appendChild(tileName);
    return div;
}
  
function createStartingTileElement(tile, rotation, leftPx, topPx) {
    const div = document.createElement("div");
    div.className = "tile";
    div.style.position = "absolute";
    div.style.left = `${leftPx*third}px`;
    div.style.top = `${topPx*third}px`;

    div.style.width = tileSize + "px";
    div.style.height = tileSize + "px";

    const img = document.createElement("img");
    img.src = "system/resources/starting tile_standard.jpg";
    img.style.transform = `rotate(${rotation*90}deg)`;

    const debug = document.createElement("div");
    debug.className = "debug";
    debug.textContent = tile.id + ` ⟳${rotation*90}°`;

    const tileName = document.createElement("div");
    tileName.className = "startingTileName";
    tileName.textContent = tile.id;
        
    div.appendChild(img);
    //div.appendChild(debug);
    div.appendChild(tileName);
    return div;
}


// ========= EIGENER ============ //

function restoreBoardFromState(tileWrapper, tileList) {
  tileWrapper.innerHTML = "";

  // ⚠️ NUR visuell zeichnen
  for (const entry of tileList) {
    tileWrapper.appendChild(
      createTileElement(entry.tile, entry.rot, entry.x, entry.y)
    );
  }
}

function normalizeGeneratedTiles(tileWrapper, output) {
  // niemals auf transformiertem Zustand messen
  tileWrapper.style.transform = "none";

  const tiles = [...tileWrapper.children];
  if (tiles.length === 0) return;

  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  tiles.forEach(tile => {
    const x = tile.offsetLeft;
    const y = tile.offsetTop;
    const w = tile.offsetWidth;
    const h = tile.offsetHeight;

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
  });

  const contentWidth  = maxX - minX;
  const contentHeight = maxY - minY;
  if (contentWidth <= 0 || contentHeight <= 0) return;

  const padding = 20;
  const outputRect = output.getBoundingClientRect();

  const scale = Math.min(
    (outputRect.width  - padding * 2) / contentWidth,
    (outputRect.height - padding * 2) / contentHeight
  );

  const translateX =
    (outputRect.width  - contentWidth  * scale) / 2 - minX * scale;
  const translateY =
    (outputRect.height - contentHeight * scale) / 2 - minY * scale;

  tileWrapper.style.transform =
    `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}





// ========= CODE ============ //
/*document.addEventListener("DOMContentLoaded", () => {
    renderTallneckBoard();
});*/

/*document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("tallneckTable");
    placedTileList.forEach(entry => {
        const tileId = entry.tile.id;
        const spawnType = getSpawnTypeForTile(tileId);
        const machines = generateMachinesForTile();

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tileId}</td>
            <td>${spawnType}</td>
            <td>${machines || "-"}</td>
        `;
        table.appendChild(row);
    });

  const tileWrapper = document.getElementById("tallneckBoardWrapper");
  const output = document.getElementById("boardContainer");

  renderBoardFromPlacedTiles({
    placedTileList,
    tileWrapper,
    outputElement: output,
    tileSizeValue: 100 // ggf. kleiner, z.B. 80
  });

});*/

function exportTallneckCardAsPNG() {
  const card = document.getElementById("tallneckCard");

  html2canvas(card, {
    backgroundColor: null, // nutzt das CSS-Hintergrundbild
    scale: 2,              // höhere Auflösung (empfohlen)
    width: 853,
    height: 1280,
    useCORS: true          // wichtig für Hintergrundbild
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "tallneck_encounter_card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

document.addEventListener("DOMContentLoaded", () => {

  /* ===== BOARD ===== */
  const output = document.getElementById("boardContainer");
  const tileWrapper = document.getElementById("tallneckBoardWrapper");

  output.style.position = "relative";
  output.style.width = "600px";
  output.style.height = "400px";

  restoreBoardFromState(tileWrapper, placedTileList);
  normalizeGeneratedTiles(tileWrapper, output);

  /* ===== TABELLE ===== */
  const table = document.getElementById("tallneckTable");

  placedTileList.forEach(entry => {
    const tileId = entry.tile.id;
    const spawnType = getSpawnTypeForTile(tileId);
    const machines = generateMachinesForTile();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${tileId}</td>
      <td>${spawnType}</td>
      <td>${machines || "-"}</td>
    `;
    table.appendChild(row);
  });

  /* ===== EXPORT ===== */
  const card = document.getElementById("tallneckCard");

  if (!card) {
    console.error("❌ tallneckCard nicht gefunden");
    return;
  }

  card.style.cursor = "pointer";

  card.addEventListener("click", exportTallneckCardAsPNG);
  card.addEventListener("touchend", exportTallneckCardAsPNG);
});



// deprecated

/*placedTileList.forEach(entry => {
    const tileId = entry.tile.id;
    const spawnPoints = getSpawnPointsForTile(tileId);

    spawnPoints.forEach(spawn => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${tileId}</td>
            <td>${spawn}</td>
            <td>${generateMachines()}</td>
        `;

        table.appendChild(row);
    });
});*/

/*console.log(placedTileList);
placedTileList.forEach(entry => {
    const tileId = entry.tile.id;
    const spawnType = getSpawnTypeForTile(tileId);
    const machines = generateMachinesForTile();

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${tileId}</td>
        <td>${spawnType}</td>
        <td>${machines || "-"}</td>
    `;
    table.appendChild(row);
});*/

//renderTallneckBoard();
