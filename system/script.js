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

//========== storage declaration ==========//
let boardGameBoxes = { CG: false, SL: false, FH: false, FW: false, SotS: false};
let encounterBriefSettings = { lvl4: false, lvl5: false, TJ: false, SB: false, FC: false, RB: false, HN: false, KS: false, LB: false, oneToTwo: false, threeToFour: false};
let encounterGeneratorGlobalSettings = { chain: false, arrangeRandom: false, mosaik: false };
let global = { encounterBoard: "", encounterBrief: "" };
let variables = { usedTileIds: new Set(), placedTiles: {}, toPlace: [], tileDefinitions: [], tileSpawnPoints: [], machineDefinitions: [], machines: [], hugeMachines: [], maxTiles: 0 };

//========== storage default declaration ==========//
const default_boardGameBoxes = { CG: true, SL: false, FH: false, FW: false, SotS: false};
const default_encounterBriefSettings = { lvl4: false, lvl5: false, TJ: false, SB: false, FC: false, RB: false, HN: false, KS: false, LB: false, oneToTwo: true, threeToFour: false};
let default_encounterGeneratorGlobalSettings = { chain: false, arrangeRandom: true, mosaik: false };
let default_global = { encounterBoard: "", encounterBrief: "" };
let default_variables = { usedTileIds: new Set(), placedTiles: {}, toPlace: [], tileDefinitions: [], tileSpawnPoints: [], machineDefinitions: [], machines: [], hugeMachines: [], maxTiles: 6 };

//========== load values from storage ==========//
function loadValuesFromStorage() {
    boardGameBoxes = JSON.parse(localStorage.getItem('boardGameBoxes')) || default_boardGameBoxes;
    
    encounterBriefSettings = JSON.parse(localStorage.getItem('encounterBriefSettings')) || default_encounterBriefSettings;
    
    document.getElementById("CG").checked = boardGameBoxes.CG;
    document.getElementById("SL").checked = boardGameBoxes.SL;
    document.getElementById("FH").checked = boardGameBoxes.FH;
    document.getElementById("FW").checked = boardGameBoxes.FW;
    document.getElementById("SotS").checked = boardGameBoxes.SotS;
    
    document.getElementById("lvl4").checked = encounterBriefSettings.lvl4;
    document.getElementById("lvl5").checked = encounterBriefSettings.lvl5;
    document.getElementById("TJ").checked = encounterBriefSettings.TJ;
    document.getElementById("SB").checked = encounterBriefSettings.SB;
    document.getElementById("FC").checked = encounterBriefSettings.FC;
    document.getElementById("RB").checked = encounterBriefSettings.RB;
    document.getElementById("HN").checked = encounterBriefSettings.HN;
    document.getElementById("KS").checked = encounterBriefSettings.KS;
    document.getElementById("LB").checked = encounterBriefSettings.LB;
    document.getElementById("1-2").checked = encounterBriefSettings.oneToTwo;
    document.getElementById("3-4").checked = encounterBriefSettings.threeToFour;

    encounterGeneratorGlobalSettings = JSON.parse(localStorage.getItem('encounterGeneratorGlobalSettings')) || default_encounterGeneratorGlobalSettings;
    document.getElementById("chain").checked = encounterGeneratorGlobalSettings.chain;
    document.getElementById("arrangeRandom").checked = encounterGeneratorGlobalSettings.arrangeRandom;
    document.getElementById("mosaik").checked = encounterGeneratorGlobalSettings.mosaik;

    document.getElementById("output").innerHTML = JSON.parse(localStorage.getItem('output')) || "";

    variables = JSON.parse(localStorage.getItem('variables')) || default_variables;
    hugeMachines = variables.hugeMachines;
    machineDefinitions = variables.machineDefinitions;
    machines = variables.machines;
    placedTiles = variables.placedTiles;
    tileDefinitions = variables.tileDefinitions;
    tileSpawnPoints = variables.tileSpawnPoints;
    toPlace = variables.toPlace;
    usedTileIds = variables.usedTileIds;
    maxTiles = variables.maxTiles;

    document.getElementById("encounterBrief").innerHTML = localStorage.getItem('encounterBrief') || "<table id='machineList'><tr><th>Primary Enemy (A)</th><th>Count</th><th>Secondary Enemy (B)</th><th>Count</th></tr></table><div id='difficultyBarContainer'></div>";

    placedTileList = JSON.parse(localStorage.getItem("placedTileList")) || [];
    const dataSet = JSON.parse(localStorage.getItem("encounterBriefData")) || {};
    encounterLevel = dataSet.level || 0;
    chosenPrimary = dataSet.primary || null;
    chosenSecondary = dataSet.secondary || null;
    document.getElementById("encounterLevel").innerHTML = "Encounter Level: " + encounterLevel;

    terrainA = JSON.parse(localStorage.getItem("terrainA")) || "";
    terrainB = JSON.parse(localStorage.getItem("terrainB")) || "";
    resources = JSON.parse(localStorage.getItem("resources")) || 0;
    document.getElementById("terrainSquare").innerHTML = "Terrain (square symbol) " + terrainA;
    document.getElementById("terrainTriangle").innerHTML = "Terrain (triangle symbol) " + terrainB;
    document.getElementById("encounterResources").innerHTML = "Encounter Resources " + resources;

    chosenPrimary = JSON.parse(localStorage.getItem("encounterBriefData")).primary || "-";
    primaryCount =  JSON.parse(localStorage.getItem("encounterBriefData")).primaryCount || 0;
    chosenSecondary =  JSON.parse(localStorage.getItem("encounterBriefData")).secondary || "-";
    secondaryCount =  JSON.parse(localStorage.getItem("encounterBriefData")).secondaryCount || "-";
    chosenDualPrimary =  JSON.parse(localStorage.getItem("encounterBriefData")).dualPrimary || "-";
    dualPrimaryCount =  JSON.parse(localStorage.getItem("encounterBriefData")).dualPrimaryCount || "-";
    chosenDualSecondary =  JSON.parse(localStorage.getItem("encounterBriefData")).dualSecondary || "-";
    dualSecondaryCount =  JSON.parse(localStorage.getItem("encounterBriefData")).dualSecondaryCount || "-";
}

//========== save values to storage ==========//
function saveValuesToStorage() {
    boardGameBoxes.CG = document.getElementById("CG").checked;
    boardGameBoxes.SL = document.getElementById("SL").checked;
    boardGameBoxes.FH = document.getElementById("FH").checked;
    boardGameBoxes.FW = document.getElementById("FW").checked;
    boardGameBoxes.SotS = document.getElementById("SotS").checked;
    
    encounterBriefSettings.lvl4 = document.getElementById("lvl4").checked;
    encounterBriefSettings.lvl5 = document.getElementById("lvl5").checked;
    encounterBriefSettings.TJ = document.getElementById("TJ").checked;
    encounterBriefSettings.SB = document.getElementById("SB").checked;
    encounterBriefSettings.FC = document.getElementById("FC").checked;
    encounterBriefSettings.RB = document.getElementById("RB").checked;
    encounterBriefSettings.HN = document.getElementById("HN").checked;
    encounterBriefSettings.KS = document.getElementById("KS").checked;
    encounterBriefSettings.LB = document.getElementById("LB").checked;
    encounterBriefSettings.oneToTwo = document.getElementById("1-2").checked;
    encounterBriefSettings.threeToFour = document.getElementById("3-4").checked;

    encounterGeneratorGlobalSettings.chain = document.getElementById("chain").checked
    encounterGeneratorGlobalSettings.arrangeRandom = document.getElementById("arrangeRandom").checked
    encounterGeneratorGlobalSettings.mosaik = document.getElementById("mosaik").checked
    localStorage.setItem('encounterGeneratorGlobalSettings', JSON.stringify(encounterGeneratorGlobalSettings));
    
    localStorage.setItem('boardGameBoxes', JSON.stringify(boardGameBoxes));
    
    localStorage.setItem('encounterBriefSettings', JSON.stringify(encounterBriefSettings));

    localStorage.setItem('output', JSON.stringify(document.getElementById("output").innerHTML));
    
    variables.hugeMachines = hugeMachines;
    variables.machineDefinitions = machineDefinitions;
    variables.machines = machines;
    variables.placedTiles = placedTiles;
    variables.tileDefinitions = tileDefinitions;
    variables.tileSpawnPoints = tileSpawnPoints;
    variables.toPlace = toPlace;
    variables.usedTileIds = usedTileIds;
    variables.maxTiles = maxTiles;
    localStorage.setItem('variables', JSON.stringify(variables));

    localStorage.setItem('encounterBrief', document.getElementById("encounterBrief").innerHTML);

    // Encounter-Brief vorbereiten
    const encounterBriefData = {
        level: encounterLevel,
        players: document.getElementById("1-2").checked ? "1-2" : "3-4",
        primary: chosenPrimary || "-",
        primaryCount: primaryCount || 0,
        secondary: chosenSecondary || "-",
        secondaryCount: secondaryCount || 0,
        dualPrimary: chosenDualPrimary || "-",
        dualPrimaryCount: dualPrimaryCount || 0,
        dualSecondary: chosenDualSecondary || "-",
        dualSecondaryCount: dualSecondaryCount || 0,
        numberOverlay: numberOverlay || false
    };
    // In localStorage speichern
    localStorage.setItem("encounterBriefData", JSON.stringify(encounterBriefData));
    localStorage.setItem("placedTileList", JSON.stringify(placedTileList));

    localStorage.setItem("resources", JSON.stringify(resources));
    localStorage.setItem("terrainA", JSON.stringify(terrainA));
    localStorage.setItem("terrainB", JSON.stringify(terrainB));
}
window.addEventListener('beforeunload', () => {
    saveValuesToStorage()
});

//========== code ==========//
const output = document.getElementById("output");
output.style.position = "relative";
output.style.width = "800px";
output.style.height = "800px";

const tileSize = 99;
const third = tileSize / 3;

let usedTileIds = new Set();
let placedTiles = {};
let toPlace = [];

//const tileDefinitions = [
//  "A1:2,0,0;0,0,0;0,1,0",
//  "A2:1,0,0;0,0,0;2,0,0",
//  "A3:0,1,0;0,0,0;0,2,0",
//  "A4:0,0,1;0,0,0;2,0,0",
//  "A5:2,0,0;0,0,0;1,0,0",
//  "A6:0,0,2;0,0,0;0,0,1"
//];

let tileDefinitions = [];
//if (document.getElementById("CG").checked == true) {
//    tileDefinitions.push("1A:2,0,0;0,0,0;0,1,0");
//    tileDefinitions.push("2A:1,0,0;0,0,0;2,0,0");
//    tileDefinitions.push("3A:0,1,0;0,0,0;0,2,0");
//    tileDefinitions.push("4A:0,0,1;0,0,0;2,0,0");
//    tileDefinitions.push("5A:2,0,0;0,0,0;1,0,0");
//    tileDefinitions.push("6A:0,0,2;0,0,0;0,0,1");
//} else if (document.getElementById("SL").checked == true) {
//    //
//} else if (document.getElementById("FH").checked == true) {
//    //
//} else if (document.getElementById("FW").checked == true) {
//    //
//} else if (document.getElementById("SotS").checked == true) {
//    //
//}

let machines = [];
let hugeMachines = [];

let tileSpawnPoints = [];
let machineDefinitions = [];

let maxTiles = 6;

let specialTiles = ["1K", "2K", "3K", "4K", "5K", "6K", "7K", "8K"];

let encounterLevel = 0;

document.getElementById("tileCount").max = '6';
document.getElementById("tileCount").min = '1';
document.getElementById("tileCount").value = '2';

// --- Maschinen für Primär / Sekundär ---
let chosenPrimary = null;
let primaryCount = 0;
let chosenSecondary = null;
let secondaryCount = 0;
let chosenDualPrimary = null;
let dualPrimaryCount = 0;
let chosenDualSecondary = null;
let dualSecondaryCount = 0;

let placedTileList = []; // Liste für Random-Auswahl

let numberOverlay = false;

let terrainA = "";
let terrainB = "";
let resources = 0;
const terrains = [
    "rocky outcrops",
    "ruins",
    "machine corpse",
    ""
];
function getRandomTerrain() {
  const index = Math.floor(Math.random() * terrains.length);
  return terrains[index];
}

loadValuesFromStorage();

machineDefinitions = [];
createMachineDefinitions();

// Neu: Key-Helfer
function posKey(x, y) {
  return `${x},${y}`;
}

function createTileDefinitions() {
    tileDefinitions = [];

    if (document.getElementById("CG").checked == true) {
        tileDefinitions.push("1A:2,0,0;0,0,0;0,1,0");
        tileSpawnPoints.push({id: "1A", spawnPoint: "A"});
        tileDefinitions.push("2A:1,0,0;0,0,0;2,0,0");
        tileSpawnPoints.push({id: "2A", spawnPoint: "A"});
        tileDefinitions.push("3A:0,1,0;0,0,0;0,2,0");
        tileSpawnPoints.push({id: "3A", spawnPoint: "B"});
        tileDefinitions.push("4A:0,0,1;0,0,0;2,0,0");
        tileSpawnPoints.push({id: "4A", spawnPoint: "A"});
        tileDefinitions.push("5A:2,0,0;0,0,0;1,0,0");
        tileSpawnPoints.push({id: "5A", spawnPoint: "B"});
        tileDefinitions.push("6A:0,0,2;0,0,0;0,0,1");
        tileSpawnPoints.push({id: "6A", spawnPoint: "B"});
    }
    if (document.getElementById("SL").checked == true) {
        tileDefinitions.push("1N:0,0,0;0,0,2;1,0,0");
        tileSpawnPoints.push({id: "1N", spawnPoint: "B"});
        tileDefinitions.push("2N:0,2,0;0,0,0;1,0,0");
        tileSpawnPoints.push({id: "2N", spawnPoint: "A"});
        tileDefinitions.push("3N:0,0,1;0,0,0;0,0,2");
        tileSpawnPoints.push({id: "3N", spawnPoint: "B"});
        tileDefinitions.push("4N:0,0,0;0,0,1;2,0,0");
        tileSpawnPoints.push({id: "4N", spawnPoint: "A"});
        tileDefinitions.push("5N:0,0,1;0,0,0;2,0,0");
        tileSpawnPoints.push({id: "5N", spawnPoint: "A"});
        tileDefinitions.push("6N:0,0,1;0,0,2;0,0,0");
        tileSpawnPoints.push({id: "6N", spawnPoint: "A"});
    }
    if (document.getElementById("FH").checked == true) {
        tileDefinitions.push("1O:0,0,1;0,0,0;2,0,0");
        tileSpawnPoints.push({id: "1O", spawnPoint: "A"});
        tileDefinitions.push("2O:0,0,2;0,0,0;0,0,1");
        tileSpawnPoints.push({id: "2O", spawnPoint: "A"});
        tileDefinitions.push("3O:0,2,0;0,0,1;0,0,0");
        tileSpawnPoints.push({id: "3O", spawnPoint: "A"});
        tileDefinitions.push("4O:0,1,0;0,0,0;0,2,0");
        tileSpawnPoints.push({id: "4O", spawnPoint: "B"});
        tileDefinitions.push("5O:2,0,0;0,0,0;0,0,1");
        tileSpawnPoints.push({id: "5O", spawnPoint: "B"});
        tileDefinitions.push("6O:0,0,0;0,0,0;2,0,1");
        tileSpawnPoints.push({id: "60", spawnPoint: "B"});
    }
    if (document.getElementById("FW").checked == true) {
        tileDefinitions.push("1B:0,2,0;0,0,0;0,0,1");
        tileSpawnPoints.push({id: "1B", spawnPoint: "A"});
        tileDefinitions.push("2B:0,1,1;0,0,0;2,2,0");
        tileSpawnPoints.push({id: "2B", spawnPoint: "B"});
        tileDefinitions.push("3B:0,0,1;0,0,0;0,0,2");
        tileSpawnPoints.push({id: "3B", spawnPoint: "B"});
        tileDefinitions.push("4B:1,1,0;0,0,0;0,2,2");
        tileSpawnPoints.push({id: "4B", spawnPoint: "B"});
        tileDefinitions.push("5B:0,1,0;0,0,0;2,0,0");
        tileSpawnPoints.push({id: "5B", spawnPoint: "A"});
        tileDefinitions.push("6B:1,0,0;0,0,0;0,0,2");
        tileSpawnPoints.push({id: "6B", spawnPoint: "B"});
    }
    if (document.getElementById("SotS").checked == true) {
        tileDefinitions.push("1C:2,0,2;0,0,0;1,0,1");
        tileSpawnPoints.push({id: "1C", spawnPoint: "A"});
        tileDefinitions.push("2C:2,0,0;0,0,0;0,1,0");
        tileSpawnPoints.push({id: "2C", spawnPoint: "B"});
        tileDefinitions.push("3C:0,0,0;2,0,1;0,0,0");
        tileSpawnPoints.push({id: "3C", spawnPoint: "A"});
        tileDefinitions.push("4C:0,0,0;2,0,1;0,0,0");
        tileSpawnPoints.push({id: "4C", spawnPoint: "A"});
        tileDefinitions.push("5C:0,0,1;2,0,0;0,0,0");
        tileSpawnPoints.push({id: "5C", spawnPoint: "B"});
        tileDefinitions.push("6C:0,2,0;0,0,0;0,0,1");
        tileSpawnPoints.push({id: "6C", spawnPoint: "B"});
    }
    if (document.getElementById("KS").checked == true) {
        tileDefinitions.push("1K:1,1,0;0,0,0;0,0,2");
        tileSpawnPoints.push({id: "1K", spawnPoint: "A"}) // SPAWPOINTS A & B
        tileDefinitions.push("2K:1,0,2;0,0,0;0,0,0");
        tileSpawnPoints.push({id: "2K", spawnPoint: "B"}) // SPAWPOINTS A & B
        tileDefinitions.push("3K:1,0,0;0,0,2;0,0,0");
        tileSpawnPoints.push({id: "3K", spawnPoint: "A"}) // SPAWPOINTS A & B
        tileDefinitions.push("4K:0,0,1;0,0,0;2,0,0");
        tileSpawnPoints.push({id: "4K", spawnPoint: "B"}) // SPAWPOINTS A & B
        tileDefinitions.push("5K:1,0,0;0,0,2;0,1,0");
        tileSpawnPoints.push({id: "5K", spawnPoint: "A"}) // SPAWPOINTS A & B
        tileDefinitions.push("6K:1,0,1;0,0,0;0,2,0");
        tileSpawnPoints.push({id: "6K", spawnPoint: "B"}) // SPAWPOINTS A & B
        tileDefinitions.push("7K:1,0,2;0,0,0;0,0,1");
        tileSpawnPoints.push({id: "7K", spawnPoint: "A"}) // SPAWPOINTS A & B
        tileDefinitions.push("8K:1,0,0;0,0,0;2,0,0");
        tileSpawnPoints.push({id: "8K", spawnPoint: "B"}) // SPAWPOINTS A & B & C
    }
}

function createMachineDefinitions() {
    machineDefinitions = [];

    if (document.getElementById("CG").checked == true) {
        machines.push("watcher");
        machines.push("grazer");
        machines.push("strider");
        machines.push("scrapper");
        machines.push("sawtooth");
        machines.push("shell-walker");

        machineDefinitions.push("watcher.4.1.w:(4,2);(4,2);(0,2);(0,4);(0,4)");
        machineDefinitions.push("grazer.4.2.x:(1,0);(2,1);(4,2);(0,4);(0,4)");
        machineDefinitions.push("strider.4.1.x:(2,0);(4,2);(0,4);(0,4);(0,4)");
        machineDefinitions.push("scrapper.4.3.s:(1,0);(2,0);(4,2);(0,4);(0,4)");
        machineDefinitions.push("sawtooth.2.5.x:(0,0);(0,0);(2,0);(0,1);(0,2)");
        machineDefinitions.push("shell-walker.2.4.h:(0,0);(1,0);(2,0);(0,2);(0,2)");
    }
    if (document.getElementById("FH").checked == true) {
        machines.push("charger");
        machines.push("lancehorn");
        machines.push("glinthawk");
        machines.push("ravager");

        machineDefinitions.push("charger.4.1.x:(2,0);(4,2);(0,4);(0,4);(0,4)");
        machineDefinitions.push("lancehorn.4.2.x:(1,0);(2,1);(4,2);(0,4);(0,4)");
        machineDefinitions.push("glinthawk.4.3.x:(1,0);(2,0);(4,2);(0,4);(0,4)");
        machineDefinitions.push("ravager.2.4.x:(0,0);(0,0);(2,0);(0,1);(0,2)");
    }
    if (document.getElementById("SotS").checked == true) {
        machines.push("broadhead");
        machines.push("trampler");
        machines.push("behemoth");

        machineDefinitions.push("broadhead.4.1.x:(2,0);(4,2);(0,4);(0,4);(0,4)");
        machineDefinitions.push("trampler.2.3.x:(0,0);(0,0);(2,0);(0,1);(0,2)");
        machineDefinitions.push("behemoth.1.4.x:(0,0);(0,0);(1,0);(0,1);(0,1)");
    }
    if (document.getElementById("KS").checked == true) {
        machines.push("cultist thug");
        machines.push("cultist heavy");
        machines.push("dervahl");
        machines.push("mercenary warrior");
        machines.push("mercenary heavy");
        machines.push("corrupted watcher");
        machines.push("corrupted scrapper");
        machines.push("corrupted fire bellowback");

        machineDefinitions.push("cultist thug.4.1.x:(4,2);(4,2);(0,2);(0,4);(0,4)");
        machineDefinitions.push("cultist heavy.4.2.x:(4,2);(4,2);(4,4);(0,4);(0,4)");
        machineDefinitions.push("dervahl.1.4.x:(0,0);(0,0);(1,0);(0,1);(0,1)");
        machineDefinitions.push("mercenary warrior.4.1.x:(4,2);(4,2);(0,2);(0,4);(0,4)");
        machineDefinitions.push("mercenary heavy.4.2.x:(4,2);(4,2);(4,4);(0,4);(0,4)");
        machineDefinitions.push("corrupted watcher.4.2.w:(4,2);(4,2);(0,2);(0,4);(0,4)");
        machineDefinitions.push("corrupted scrapper.4.4.s:(1,0);(2,0);(4,2);(0,4);(0,4)");
        machineDefinitions.push("corrupted fire bellowback.2.5.b:(0,0);(1,0);(2,0);(0,2);(0,2)");
    }
    if (document.getElementById("SL").checked == true) {
        machines.push("redeye watcher");
        machines.push("longleg");
        machines.push("stalker");
        machines.push("snapmaw");
        machines.push("fire bellowback");
        machines.push("freeze bellowback");

        machineDefinitions.push("redeye watcher.4.2.w:(4,2);(4,2);(0,2);(0,4);(0,4)");
        machineDefinitions.push("longleg.2.3.x:(0,0);(1,0);(2,0);(0,2);(0,2)");
        machineDefinitions.push("stalker.2.4.x:(0,0);(1,0);(2,0);(0,2);(0,2)");
        machineDefinitions.push("snapmaw.2.4.x:(0,0);(1,0);(2,0);(0,2);(0,2)");
        machineDefinitions.push("fire bellowback.2.4.b:(0,0);(1,0);(2,0);(0,2);(0,2)");
        machineDefinitions.push("freeze bellowback.2.4.b:(0,0);(1,0);(2,0);(0,2);(0,2)");
    }
    if (document.getElementById("LB").checked == true) {
        machines.push("bandit thug");
        machines.push("bandit fighter");
        machines.push("bandit heavy");
        machines.push("bandit marksman");
        machines.push("bandit slugger");
        machines.push("bandit brute");

        machineDefinitions.push("bandit thug.4.1.x:(4,2);(4,2);(0,2);(0,4);(0,4)");
        machineDefinitions.push("bandit fighter.4.2.x:(4,2);(4,2);(0,2);(0,4);(0,4)");
        machineDefinitions.push("bandit heavy.4.3.x:(4,2);(4,2);(4,4);(0,4);(0,4)");
        machineDefinitions.push("bandit marksman.4.1.x:(4,2);(4,2);(0,2);(0,4);(0,4)");
        machineDefinitions.push("bandit slugger.4.2.x:(4,2);(4,2);(4,4);(0,4);(0,4)");
        machineDefinitions.push("bandit brute.4.3.x:(4,2);(4,2);(4,4);(0,4);(0,4)");
    }
    if (document.getElementById("FW").checked == true) {
        machines.push("daemonic shell-walker");
        machines.push("daemonic watcher");
        machines.push("daemonic scrapper");
        machines.push("scorcher");
        machines.push("frostclaw");
        
        machineDefinitions.push("daemonic shell-walker.2.5.h:(0,0);(1,0);(2,0);(0,2);(0,2)");
        machineDefinitions.push("daemonic watcher.4.2.w:(4,2);(4,2);(0,2);(0,4);(0,4)");
        machineDefinitions.push("daemonic scrapper.4.4.s:(1,0);(2,0);(4,2);(0,4);(0,4)");
        machineDefinitions.push("scorcher.2.4.x:(0,0);(1,0);(2,0);(0,2);(0,2)");
        machineDefinitions.push("frostclaw.2.5.x:(0,0);(1,0);(2,0);(0,2);(0,2)");
    }
    
    if (document.getElementById("TJ").checked == true) {
        hugeMachines.push("thunderjaw");

        machineDefinitions.push("thunderjaw.1.5.x:(0,0);(0,0);(0,0);(1,0);(1,0)");
    }
    if (document.getElementById("SB").checked == true) {
        hugeMachines.push("stormbird");

        machineDefinitions.push("stormbird.1.5.x:(0,0);(0,0);(0,0);(1,0);(1,0)");
    }
    if (document.getElementById("FC").checked == true) {
        hugeMachines.push("fireclaw");

        machineDefinitions.push("fireclaw.1.5.x:(0,0);(0,0);(0,0);(1,0);(1,0)");
    }
    if (document.getElementById("RB").checked == true) {
        hugeMachines.push("rock breaker");

        machineDefinitions.push("rock breaker.1.5.x:(0,0);(0,0);(0,0);(1,0);(1,0)");
    }
    if (document.getElementById("HN").checked == true) {
        hugeMachines.push("deathbringer");
        machines.push("corruptor");

        machineDefinitions.push("deathbringer.1.5.x:(0,0);(0,0);(1,0);(1,0);(1,0)");
        machineDefinitions.push("corruptor.2.4.x:(0,0);(1,0);(1,2);(0,2);(0,2)");
    }
}

function parseTile(definition) {
  const [id, matrixStr] = definition.split(":");
  const matrix = matrixStr.split(";").map(row => row.split(",").map(Number));
  return { id, matrix };
}
  
function rotateMatrix(matrix, degrees) {
  const times = ((degrees % 360) + 360) % 360 / 90;
  let result = matrix.map(row => row.slice());
  const rotateOnce = m => m[0].map((_, i) => m.map(row => row[i])).reverse();
  for (let i = 0; i < times; i++) result = rotateOnce(result);
  return result;
}

function createTileElement(tile, rotation, leftPx, topPx) {
    const div = document.createElement("div");
    div.className = "tile";
    div.style.position = "absolute";
    div.style.left = `${leftPx*third}px`;
    div.style.top = `${topPx*third}px`;

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

function generateGrid() {
    // FIX: Definitions und Listen pro Run zurücksetzen
    tileDefinitions = [];
    machines = [];
    hugeMachines = [];

    createTileDefinitions();
    createMachineDefinitions();
        
    const tileCount = parseInt(document.getElementById("tileCount").value, 10);

    output.innerHTML = "";

    //const tileSize = 100;
    //const third = tileSize / 3;

    //    const usedTileIds = new Set();
    //    const placedTiles = {};
    //    const toPlace = [];
        
    usedTileIds = new Set();
    placedTiles = {}; // Map: belegte Gitterzellen
    placedTileList = []; // Liste für Random-Auswahl
    toPlace = [];

    // --- Starttile wählen & platzieren ---
    const startDef = tileDefinitions[Math.floor(Math.random() * tileDefinitions.length)];
    let base = parseTile(startDef);
    usedTileIds.add(base.id);

    for (const specialTileID of specialTiles) {
        if (base.id == specialTileID) {
            if (specialTileID == "1K") usedTileIds.add("5K");
            if (specialTileID == "2K") usedTileIds.add("6K");
            if (specialTileID == "3K") usedTileIds.add("7K");
            if (specialTileID == "4K") usedTileIds.add("8K");
            
            if (specialTileID == "5K") usedTileIds.add("1K");
            if (specialTileID == "6K") usedTileIds.add("2K");
            if (specialTileID == "7K") usedTileIds.add("3K");
            if (specialTileID == "8K") usedTileIds.add("4K");
        }
    }

    //placedTiles["0,0"] = { ...base, rotation: 0, posX: 0, posY: 0 };

    // arbeiten im 3er-Gitter (x,y je Drittel)
    let baseX = 9;
    let baseY = 9;
    let baseRot = 0;
    let baseMatrixRot = base.matrix; // aktuell rotierte Matrix des Base-Tiles

    output.appendChild(createStartingTileElement(base, baseRot, baseX, baseY));
    //placedTiles[posKey(baseX, baseY)] = { id: base.id, matrix: baseMatrixRot, rot: baseRot, x: baseX, y: baseY };
    occupyCells(base.id, baseMatrixRot, baseRot, baseX, baseY);
    placedTileList.push({ tile: base, x: baseX, y: baseY, rot: baseRot, matrix: baseMatrixRot });

    //output.appendChild(createTileElement(base, 0, 0, 6));
    //output.appendChild(createTileElement(base, 0, 3, 6));

    //toPlace.push({ x: 6, y: 6, tile: base, matrix: base.matrix, rotation: 0 });

    //1. random: entry/exit point als Anpassungspunkt
    //2. Bestimmung der Position des Anlegebereichs oben/rechts/unten/links
    //3. Anhand des Anlagebereichs Berechnung der Grundkoordinate (+-3 entlang der jeweiligen Achse von der Grundkoordinate des bereits gelegten Tiles)
    //4. random: tile welches bisher noch nicht verwendet wurde und eintragen als verwendet
    //5. Bestimmung der Drehrichtung des anzulegenden Tiles (1 -> 2 bzw. 2 -> 1) indem Position des entry/exit points bestimmt wird und mit der Drehrichtung des vorher gelegten Tiles verglichen wird
    //6. Position des entry/exit points beider Tiles bestimmen (xPos bei oben/unten bzw. yPos bei rechts/links als Anlagebereich)
    //7. Versatz der entry/exit points berechnen und in der x bzw. y Position des anzulegenden Tiles einberechnen
    //8. Tile generieren (x, y, rot)

    if (document.getElementById("chain").checked == true) {
        chain(tileDefinitions, tileCount, output, usedTileIds, placedTiles, toPlace, startDef, base, baseX, baseY, baseRot, baseMatrixRot, placedTileList);
    } else if (document.getElementById("arrangeRandom").checked == true) {
        arrangeRandom(tileDefinitions, tileCount, output, usedTileIds, placedTiles, toPlace, startDef, base, baseX, baseY, baseRot, baseMatrixRot, placedTileList);
    } else if (document.getElementById("planeGrid2x2").checked == true) {
        planeGrid(tileDefinitions, tileCount, output, usedTileIds, placedTiles, toPlace, startDef, base, baseX, baseY, baseRot, baseMatrixRot, placedTileList, "2x2")
    } else if (document.getElementById("planeGrid3x3").checked == true) {
        planeGrid(tileDefinitions, tileCount, output, usedTileIds, placedTiles, toPlace, startDef, base, baseX, baseY, baseRot, baseMatrixRot, placedTileList, "3x3")
    } else {
        mosaik(tileDefinitions, tileCount, output, usedTileIds, placedTiles, toPlace, startDef, base, baseX, baseY, baseRot, baseMatrixRot, placedTileList);
    }
}

function occupyCells(tileId, matrix, rot, x, y) {
  const occupied = [];
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      const key = posKey(x + dx, y + dy);
      placedTiles[key] = { id: tileId, rot, x: x + dx, y: y + dy };
      occupied.push(key);
    }
  }
  //return occupied; // optional: Zurückverfolgung
}

function canPlaceAt(x, y) {
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      if (placedTiles[posKey(x + dx, y + dy)]) {
        return false; // schon belegt
      }
    }
  }
  return true;
}

function chain(tileDefinitions, tileCount, output, usedTileIds, placedTiles, toPlace, startDef, base, baseX, baseY, baseRot, baseMatrixRot, placedTileList) {
    // --- Folge-Tiles chainen ---
    for (let i = 1; i < tileCount; i++) {
        // 1) Zufällig 1 oder 2 als Verbindungspunkt wählen
        const point = Math.floor(Math.random() * 2) + 1;

        // 2) Join-Position (0=oben,1=rechts,2=unten,3=links) + lokale Koordinate am Rand im **rotieren** Base finden
        let baseJoinPoint = -1;
        let xPosBase = 0, yPosBase = 0;

        // FIX: baseMatrixRot statt base.matrix (wir müssen die aktuelle Rotation beachten)
        const M = baseMatrixRot;

        if (M[0][0] === point) { baseJoinPoint = 0; xPosBase = 0; yPosBase = 0; }
        else if (M[0][1] === point) { baseJoinPoint = 0; xPosBase = 1; yPosBase = 0; }
        else if (M[0][2] === point) { baseJoinPoint = 1; xPosBase = 2; yPosBase = 0; }
        else if (M[1][2] === point) { baseJoinPoint = 1; xPosBase = 2; yPosBase = 1; }
        else if (M[2][2] === point) { baseJoinPoint = 2; xPosBase = 2; yPosBase = 2; }
        else if (M[2][1] === point) { baseJoinPoint = 2; xPosBase = 1; yPosBase = 2; }
        else if (M[2][0] === point) { baseJoinPoint = 3; xPosBase = 0; yPosBase = 2; }
        else if (M[1][0] === point) { baseJoinPoint = 3; xPosBase = 0; yPosBase = 1; }
        else {
            // Falls der gewünschte Punkt auf dem Base nicht vorhanden ist, wähle Fallback: nächste freie Seite
            baseJoinPoint = [0,1,2,3][Math.floor(Math.random()*4)];
            xPosBase = (baseJoinPoint === 1 || baseJoinPoint === 2) ? 2 : 0;
            yPosBase = (baseJoinPoint === 2 || baseJoinPoint === 3) ? 2 : 0;
        }

        // 3) Ziel-Grundposition relativ zum **vorherigen** Tile (je Seite +/-3 im Gitter)
        let targetX = baseX;
        let targetY = baseY;
        if (baseJoinPoint === 0) targetY -= 3;      // oben
        else if (baseJoinPoint === 1) targetX += 3; // rechts
        else if (baseJoinPoint === 2) targetY += 3; // unten
        else if (baseJoinPoint === 3) targetX -= 3; // links

        // Belegung prüfen – bei Kollision: andererseits versuchen (max. ein paar Re-Rolls)
        let attempts = 0;
        while (placedTiles[posKey(targetX, targetY)] && attempts < 8) {
        // Rolle eine neue Seite am Base
        baseJoinPoint = (baseJoinPoint + 1) % 4;
        targetX = baseX;
        targetY = baseY;
        if (baseJoinPoint === 0) targetY -= 3;
            else if (baseJoinPoint === 1) targetX += 3;
            else if (baseJoinPoint === 2) targetY += 3;
            else if (baseJoinPoint === 3) targetX -= 3;
            attempts++;
        }
        if (placedTiles[posKey(targetX, targetY)]) {
            // Keine freie Nachbarzelle gefunden – brich sauber ab.
            break;
        }

        // 4) Zufälliges, noch ungenutztes Tile wählen
        const unusedTiles = [];
        for (const def of tileDefinitions) {
            const cand = parseTile(def);
            if (!usedTileIds.has(cand.id)) unusedTiles.push(cand);
        }
        if (unusedTiles.length === 0) break; // nichts mehr übrig
        const newTile = unusedTiles[Math.floor(Math.random() * unusedTiles.length)];
        usedTileIds.add(newTile.id);

        for (const specialTileID of specialTiles) {
            if (newTile.id == specialTileID) {
                if (specialTileID == "1K") usedTileIds.add("5K");
                if (specialTileID == "2K") usedTileIds.add("6K");
                if (specialTileID == "3K") usedTileIds.add("7K");
                if (specialTileID == "4K") usedTileIds.add("8K");
                
                if (specialTileID == "5K") usedTileIds.add("1K");
                if (specialTileID == "6K") usedTileIds.add("2K");
                if (specialTileID == "7K") usedTileIds.add("3K");
                if (specialTileID == "8K") usedTileIds.add("4K");
            }
        }

        // 5) Gegenstück zum Punkt wählen (1 <-> 2) – FIX: richtige Zuweisung!
        let pointRev = (point === 1 ? 2 : 1);

        // Join-Seite des neuen Tiles im **unrotierten** Zustand suchen
        let joinPoint = 0;
        if (newTile.matrix[0][0] === pointRev) { joinPoint = 0; }
        else if (newTile.matrix[0][1] === pointRev) { joinPoint = 0; }
        else if (newTile.matrix[0][2] === pointRev) { joinPoint = 1; }
        else if (newTile.matrix[1][2] === pointRev) { joinPoint = 1; }
        else if (newTile.matrix[2][2] === pointRev) { joinPoint = 2; }
        else if (newTile.matrix[2][1] === pointRev) { joinPoint = 2; }
        else if (newTile.matrix[2][0] === pointRev) { joinPoint = 3; }
        else if (newTile.matrix[1][0] === pointRev) { joinPoint = 3; }

        // Rotationsberechnung: rot = baseJoinPoint - joinPoint + 2  (danach modulo 4)
        let rot = baseJoinPoint - joinPoint + 2;
        rot = ((rot % 4) + 4) % 4; // FIX: normalisieren

        // 6) Rotierte Matrix des neuen Tiles bestimmen, um die exakte Kontakt-Position zu kennen
        let rotTileMatrix = newTile.matrix;
        if (rot === 1) rotTileMatrix = rotateMatrix(newTile.matrix, 90);
        else if (rot === 2) rotTileMatrix = rotateMatrix(newTile.matrix, 180);
        else if (rot === 3) rotTileMatrix = rotateMatrix(newTile.matrix, 270);

        // Eintritts-/Austrittspunkt im rotierten Tile finden
        let xPosTile = 0, yPosTile = 0;
        if (rotTileMatrix[0][0] === pointRev) { xPosTile = 0; yPosTile = 0; }
        else if (rotTileMatrix[0][1] === pointRev) { xPosTile = 1; yPosTile = 0; }
        else if (rotTileMatrix[0][2] === pointRev) { xPosTile = 2; yPosTile = 0; }
        else if (rotTileMatrix[1][2] === pointRev) { xPosTile = 2; yPosTile = 1; }
        else if (rotTileMatrix[2][2] === pointRev) { xPosTile = 2; yPosTile = 2; }
        else if (rotTileMatrix[2][1] === pointRev) { xPosTile = 1; yPosTile = 2; }
        else if (rotTileMatrix[2][0] === pointRev) { xPosTile = 0; yPosTile = 2; }
        else if (rotTileMatrix[1][0] === pointRev) { xPosTile = 0; yPosTile = 1; }

        // Feinausrichtung: Kontaktpunkte aufeinanderlegen
        let xPosGlob = targetX;
        let yPosGlob = targetY;
        if (baseJoinPoint === 0) { // oben: gleiche X-Spalte
        xPosGlob = targetX + (xPosBase - xPosTile);
        } else if (baseJoinPoint === 1) { // rechts: gleiche Y-Zeile
        yPosGlob = targetY + (yPosBase - yPosTile);
        } else if (baseJoinPoint === 2) { // unten: gleiche X-Spalte
        xPosGlob = targetX + (xPosBase - xPosTile);
        } else if (baseJoinPoint === 3) { // links: gleiche Y-Zeile
        yPosGlob = targetY + (yPosBase - yPosTile);
        }

        // Jetzt prüfen, ob der gesamte 3x3-Block frei ist
        if (!canPlaceAt(xPosGlob, yPosGlob)) {
        continue; // Überspringen, wenn blockiert
        }

        // Wenn frei: Tile platzieren
        output.appendChild(createTileElement(newTile, rot, xPosGlob, yPosGlob));
        occupyCells(newTile.id, rotTileMatrix, rot, xPosGlob, yPosGlob);
        placedTileList.push({ tile: newTile, x: xPosGlob, y: yPosGlob, rot, matrix: rotTileMatrix });

        // Neues Tile als Basis für nächste Iteration
        base = newTile;
        baseX = xPosGlob;
        baseY = yPosGlob;
        baseRot = rot;
        baseMatrixRot = rotTileMatrix;
    }
}

function arrangeRandom(tileDefinitions, tileCount, output, usedTileIds, placedTiles, toPlace, startDef, base, baseX, baseY, baseRot, baseMatrixRot, placedTileList) {
    // --- Folge-Tiles random arrangieren ---
    for (let i = 1; i < tileCount; i++) {
    let success = false;

    // Versuche, ein Tile zu platzieren
    for (let attempt = 0; attempt < 50 && !success; attempt++) {
      // Random: wähle ein Basis-Tile aus allen bisher gesetzten
      const baseEntry = placedTileList[Math.floor(Math.random() * placedTileList.length)];
      const base = baseEntry.tile;
      const baseX = baseEntry.x;
      const baseY = baseEntry.y;
      const baseRot = baseEntry.rot;
      const baseMatrixRot = baseEntry.matrix;

      // Random: wähle einen Verbindungspunkt (1 oder 2)
      const point = Math.floor(Math.random() * 2) + 1;

      // Anschlussseite am Base suchen
      let baseJoinPoint = -1;
      let xPosBase = 0, yPosBase = 0;
      const M = baseMatrixRot;

      if (M[0][0] === point) { baseJoinPoint = 0; xPosBase = 0; yPosBase = 0; }
      else if (M[0][1] === point) { baseJoinPoint = 0; xPosBase = 1; yPosBase = 0; }
      else if (M[0][2] === point) { baseJoinPoint = 1; xPosBase = 2; yPosBase = 0; }
      else if (M[1][2] === point) { baseJoinPoint = 1; xPosBase = 2; yPosBase = 1; }
      else if (M[2][2] === point) { baseJoinPoint = 2; xPosBase = 2; yPosBase = 2; }
      else if (M[2][1] === point) { baseJoinPoint = 2; xPosBase = 1; yPosBase = 2; }
      else if (M[2][0] === point) { baseJoinPoint = 3; xPosBase = 0; yPosBase = 2; }
      else if (M[1][0] === point) { baseJoinPoint = 3; xPosBase = 0; yPosBase = 1; }
      else { baseJoinPoint = [0, 1, 2, 3][Math.floor(Math.random() * 4)]; }

      // Zielkoordinaten (3er Schritte)
      let targetX = baseX;
      let targetY = baseY;
      if (baseJoinPoint === 0) targetY -= 3;
      else if (baseJoinPoint === 1) targetX += 3;
      else if (baseJoinPoint === 2) targetY += 3;
      else if (baseJoinPoint === 3) targetX -= 3;

      // Zufälliges unbenutztes Tile
      const unusedTiles = [];
      for (const def of tileDefinitions) {
        const cand = parseTile(def);
        if (!usedTileIds.has(cand.id)) unusedTiles.push(cand);
      }
      if (unusedTiles.length === 0) break;
      const newTile = unusedTiles[Math.floor(Math.random() * unusedTiles.length)];
      usedTileIds.add(newTile.id);
      
      for (const specialTileID of specialTiles) {
        if (newTile.id == specialTileID) {
            if (specialTileID == "1K") usedTileIds.add("5K");
            if (specialTileID == "2K") usedTileIds.add("6K");
            if (specialTileID == "3K") usedTileIds.add("7K");
            if (specialTileID == "4K") usedTileIds.add("8K");
            
            if (specialTileID == "5K") usedTileIds.add("1K");
            if (specialTileID == "6K") usedTileIds.add("2K");
            if (specialTileID == "7K") usedTileIds.add("3K");
            if (specialTileID == "8K") usedTileIds.add("4K");
        }
      }

      // Gegenstück zum Punkt
      const pointRev = (point === 1 ? 2 : 1);

      // Anschlussseite am neuen Tile (unrotiert)
      let joinPoint = 0;
      if (newTile.matrix[0][0] === pointRev) joinPoint = 0;
      else if (newTile.matrix[0][1] === pointRev) joinPoint = 0;
      else if (newTile.matrix[0][2] === pointRev) joinPoint = 1;
      else if (newTile.matrix[1][2] === pointRev) joinPoint = 1;
      else if (newTile.matrix[2][2] === pointRev) joinPoint = 2;
      else if (newTile.matrix[2][1] === pointRev) joinPoint = 2;
      else if (newTile.matrix[2][0] === pointRev) joinPoint = 3;
      else if (newTile.matrix[1][0] === pointRev) joinPoint = 3;

      // Rotationsberechnung
      let rot = baseJoinPoint - joinPoint + 2;
      rot = ((rot % 4) + 4) % 4;

      // Matrix rotieren
      let rotTileMatrix = newTile.matrix;
      if (rot === 1) rotTileMatrix = rotateMatrix(newTile.matrix, 90);
      else if (rot === 2) rotTileMatrix = rotateMatrix(newTile.matrix, 180);
      else if (rot === 3) rotTileMatrix = rotateMatrix(newTile.matrix, 270);

      // Eintrittspunkt im rotierten Tile
      let xPosTile = 0, yPosTile = 0;
      if (rotTileMatrix[0][0] === pointRev) { xPosTile = 0; yPosTile = 0; }
      else if (rotTileMatrix[0][1] === pointRev) { xPosTile = 1; yPosTile = 0; }
      else if (rotTileMatrix[0][2] === pointRev) { xPosTile = 2; yPosTile = 0; }
      else if (rotTileMatrix[1][2] === pointRev) { xPosTile = 2; yPosTile = 1; }
      else if (rotTileMatrix[2][2] === pointRev) { xPosTile = 2; yPosTile = 2; }
      else if (rotTileMatrix[2][1] === pointRev) { xPosTile = 1; yPosTile = 2; }
      else if (rotTileMatrix[2][0] === pointRev) { xPosTile = 0; yPosTile = 2; }
      else if (rotTileMatrix[1][0] === pointRev) { xPosTile = 0; yPosTile = 1; }

      // Feinausrichtung
      let xPosGlob = targetX;
      let yPosGlob = targetY;
      if (baseJoinPoint === 0) xPosGlob = targetX + (xPosBase - xPosTile);
      else if (baseJoinPoint === 1) yPosGlob = targetY + (yPosBase - yPosTile);
      else if (baseJoinPoint === 2) xPosGlob = targetX + (xPosBase - xPosTile);
      else if (baseJoinPoint === 3) yPosGlob = targetY + (yPosBase - yPosTile);

      // Check Belegung
      if (!canPlaceAt(xPosGlob, yPosGlob)) {
        continue; // nächster Versuch mit anderem Base-Tile
      }

      // Platzieren
      output.appendChild(createTileElement(newTile, rot, xPosGlob, yPosGlob));
      occupyCells(newTile.id, rotTileMatrix, rot, xPosGlob, yPosGlob);
      placedTileList.push({ tile: newTile, x: xPosGlob, y: yPosGlob, rot, matrix: rotTileMatrix });

      success = true;
    }

    if (!success) {
      console.log("Konnte kein passendes Feld für Tile finden");
    }
  }
}

function mosaik(tileDefinitions, tileCount, output, usedTileIds, placedTiles, toPlace, startDef, base, baseX, baseY, baseRot, baseMatrixRot, placedTileList) {
    // --- Weitere Tiles ---
    for (let i = 1; i < tileCount; i++) {
        let success = false;

        // Versuch, ein Tile an eine bestehende Fläche anzulegen
        for (let attempt = 0; attempt < 100 && !success; attempt++) {
        // Random: wähle ein gesetztes Tile
        const baseEntry = placedTileList[Math.floor(Math.random() * placedTileList.length)];
        const { x: baseX, y: baseY } = baseEntry;

        // Random: wähle eine Nachbarposition (oben, rechts, unten, links)
        const dirs = [
            { dx: 0, dy: -3 }, // oben
            { dx: 3, dy: 0 },  // rechts
            { dx: 0, dy: 3 },  // unten
            { dx: -3, dy: 0 }, // links
        ];
        const dir = dirs[Math.floor(Math.random() * dirs.length)];

        const newX = baseX + dir.dx;
        const newY = baseY + dir.dy;

        // Prüfen, ob der Platz frei ist
        if (!canPlaceAt(newX, newY)) continue;

        // Neues zufälliges Tile (beliebige Rotation erlaubt)
        const unusedTiles = [];
        for (const def of tileDefinitions) {
            const cand = parseTile(def);
            if (!usedTileIds.has(cand.id)) unusedTiles.push(cand);
        }
        if (unusedTiles.length === 0) break;

        const newTile = unusedTiles[Math.floor(Math.random() * unusedTiles.length)];
        usedTileIds.add(newTile.id);

        for (const specialTileID of specialTiles) {
            if (newTile.id == specialTileID) {
                if (specialTileID == "1K") usedTileIds.add("5K");
                if (specialTileID == "2K") usedTileIds.add("6K");
                if (specialTileID == "3K") usedTileIds.add("7K");
                if (specialTileID == "4K") usedTileIds.add("8K");
                
                if (specialTileID == "5K") usedTileIds.add("1K");
                if (specialTileID == "6K") usedTileIds.add("2K");
                if (specialTileID == "7K") usedTileIds.add("3K");
                if (specialTileID == "8K") usedTileIds.add("4K");
            }
        }

        const rot = Math.floor(Math.random() * 4);
        let rotTileMatrix = newTile.matrix;
        if (rot === 1) rotTileMatrix = rotateMatrix(newTile.matrix, 90);
        else if (rot === 2) rotTileMatrix = rotateMatrix(newTile.matrix, 180);
        else if (rot === 3) rotTileMatrix = rotateMatrix(newTile.matrix, 270);

        // Platzieren
        output.appendChild(createTileElement(newTile, rot, newX, newY));
        occupyCells(newTile.id, rotTileMatrix, rot, newX, newY);
        placedTileList.push({ tile: newTile, x: newX, y: newY, rot, matrix: rotTileMatrix });

        success = true;
        }

        if (!success) {
        console.log("Kein Platz mehr für Tile gefunden");
        }
    }
}

function differ(string) {
    if (string == "chain") {
        document.getElementById("chain").checked = true;
        document.getElementById("arrangeRandom").checked = false;
        document.getElementById("mosaik").checked = false;
        document.getElementById("planeGrid2x2").checked = false;
        document.getElementById("planeGrid3x3").checked = false;
    } else if (string == "arrangeRandom") {
        document.getElementById("chain").checked = false;
        document.getElementById("arrangeRandom").checked = true;
        document.getElementById("mosaik").checked = false;
        document.getElementById("planeGrid2x2").checked = false;
        document.getElementById("planeGrid3x3").checked = false;
    } else if (string == "1-2") {
        document.getElementById("1-2").checked = true;
        document.getElementById("3-4").checked = false;
    } else if (string == "3-4") {
        document.getElementById("1-2").checked = false;
        document.getElementById("3-4").checked = true;
    } else if (string == "planeGrid2x2") {
        document.getElementById("chain").checked = false;
        document.getElementById("arrangeRandom").checked = false;
        document.getElementById("mosaik").checked = false;
        document.getElementById("planeGrid2x2").checked = true;
        document.getElementById("planeGrid3x3").checked = false;
    } else if (string == "planeGrid3x3") {
        document.getElementById("chain").checked = false;
        document.getElementById("arrangeRandom").checked = false;
        document.getElementById("mosaik").checked = false;
        document.getElementById("planeGrid2x2").checked = false;
        document.getElementById("planeGrid3x3").checked = true;
    } else {
        document.getElementById("chain").checked = false;
        document.getElementById("arrangeRandom").checked = false;
        document.getElementById("mosaik").checked = true;
    }
}

function parseMachineDefinitions() {
  let parsedMachines = [];

  for (const def of machineDefinitions) {
    let [name, lvl, diff, , levelsStr] = def.split(".");
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
      levels
    });
  }

  return parsedMachines;
}


function renderDifficultyBar(diff) {
  const containerId = "difficultyBarContainer";
  let container = document.getElementById(containerId);

  // Falls noch nicht existiert → neu erstellen
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }

  // Container leeren
  container.innerHTML = "";

  // === Balken erstellen ===
  const bar = document.createElement("div");
  bar.style.position = "relative";
  bar.style.width = "100%";
  bar.style.maxWidth = "500px";
  bar.style.height = "30px";
  bar.style.background = "linear-gradient(to right, green, yellow, orange, red)";
  bar.style.margin = "10px 0";
  bar.style.borderRadius = "6px";

  // === Labels für die Schwierigkeitsstufen ===
  const labels = ["easy (1)", "normal (2)", "hard (3)", "very hard (4)", "ultra hard (5)"];
  labels.forEach((label, i) => {
    const lbl = document.createElement("div");
    lbl.innerText = label;
    lbl.style.position = "absolute";
    lbl.style.top = "35px";
    lbl.style.left = `${(i / 4) * 100}%`;
    lbl.style.transform = "translateX(-50%)";
    lbl.style.fontSize = "12px";
    bar.appendChild(lbl);
  });

  // === Pfeil für den aktuellen Difficulty-Wert ===
  if (diff > 0) {
    const arrow = document.createElement("div");
    arrow.innerHTML = "&#9660;"; // schwarzer Pfeil nach unten ▼
    arrow.style.position = "absolute";
    arrow.style.top = "-20px";

    // Position berechnen: diff ∈ [1,5] → 0%–100%
    const posPercent = ((diff - 1) / 4) * 100;
    arrow.style.left = `${posPercent}%`;
    arrow.style.transform = "translateX(-50%)";
    arrow.style.fontSize = "18px";
    arrow.style.color = "black";

    bar.appendChild(arrow);
  }

  container.appendChild(bar);
}

function generateEncounterBriefV4() {
    createMachineDefinitions();

    const levelIndicator = document.getElementById("encounterLevel");
    const machineList = document.getElementById("machineList");
    let tableInnerHtml = "";
    let encounterLevel = 0;

    // --- Level zufällig bestimmen ---
    if (document.getElementById("lvl4").checked && document.getElementById("lvl5").checked) {
        encounterLevel = Math.floor(Math.random() * 5) + 1; // 1-5
    } else if (document.getElementById("lvl4").checked) {
        encounterLevel = Math.floor(Math.random() * 4) + 1; // 1-4
    } else if (document.getElementById("lvl5").checked) {
        encounterLevel = Math.floor(Math.random() * 5) + 1;
        if (encounterLevel === 4) encounterLevel = 3;
    } else {
        encounterLevel = Math.floor(Math.random() * 3) + 1;
    }

    // --- Spieleranzahl bestimmen ---
    const is12Players = document.getElementById("1-2").checked;
    const is34Players = document.getElementById("3-4").checked;
    const spawnFactor = is12Players ? 1 : (is34Players ? 2 : 1);

    // --- Maschinen für Primär / Sekundär ---
    chosenPrimary = null;
    chosenSecondary = null;

    // Zähler für globale Maschinenanzahl
    const usedMachinesCount = {};

    // Tiles durchgehen
    let primaryTotalCount = 0;
    let secondaryTotalCount = 0;
    const enemyDiffs = [];

    let primaryMax = 0;
    let secondaryMax = 0;

    // Für jede Tile prüfen, welcher Spawnpoint A/B und Maschinenanzahl möglich
    for (const tile of tileSpawnPoints) {
        const spawnPoint = tile.spawnPoint; // A oder B

        // Filtern gültige Maschinen für Level
        const validMachines = machineDefinitions.map(def => {
            const [nameType, levelData] = def.split(":");
            const parts = nameType.split(".");
            const name = parts.slice(0, -3).join(".");
            const amount = parseInt(parts[parts.length - 3], 10);
            const difficultyModifier = parseInt(parts[parts.length - 2], 10);
            const shared = parts[parts.length - 1];
            const levels = levelData.split(";").map(v => {
                const nums = v.replace(/[()]/g, "").split(",");
                return { primary: parseInt(nums[0]) || 0, secondary: parseInt(nums[1]) || 0 };
            });
            return { name, amount, difficultyModifier, shared, levels };
        });

        // --- Primär Enemy ---
        if (spawnPoint === "A") {
            const candidates = validMachines.filter(m => {
                let levelData = m.levels[encounterLevel - 1] || { primary: 0 };
                return levelData.primary > 0;
            });
            if (candidates.length > 0) {
                let machine = candidates[Math.floor(Math.random() * candidates.length)];
                let levelData = machine.levels[encounterLevel - 1];
                let maxAllowed = levelData.primary;
                primaryMax = maxAllowed;
                let used = usedMachinesCount[machine.name] || 0;
                let count = Math.min(maxAllowed - used, spawnFactor, machine.amount - used);
                if (count > 0) {
                    usedMachinesCount[machine.name] = used + count;
                    chosenPrimary = machine.name;
                    primaryTotalCount += count;
                    for (let k = 0; k < count; k++) enemyDiffs.push(machine.difficultyModifier); // pro Exemplar!
                }
            }
        }

        // --- Sekundär Enemy ---
        if (spawnPoint === "B") {
            const candidates = validMachines.filter(m => {
                let levelData = m.levels[encounterLevel - 1] || { secondary: 0 };
                return levelData.secondary > 0;
            });
            if (candidates.length > 0) {
                let machine = candidates[Math.floor(Math.random() * candidates.length)];
                let levelData = machine.levels[encounterLevel - 1];
                let maxAllowed = levelData.secondary;
                secondaryMax = maxAllowed;
                let used = usedMachinesCount[machine.name] || 0;
                let count = Math.min(maxAllowed - used, spawnFactor, machine.amount - used);
                if (count > 0) {
                    usedMachinesCount[machine.name] = used + count;
                    chosenSecondary = machine.name;
                    secondaryTotalCount += count;
                    for (let k = 0; k < count; k++) enemyDiffs.push(machine.difficultyModifier); // pro Exemplar!
                }
            }
        }
    }

    // --- Difficulty berechnen ---
    let diff = 0;
    if (enemyDiffs.length > 0) {
        diff = parseFloat((enemyDiffs.reduce((a, b) => a + b, 0) / enemyDiffs.length).toFixed(2));
    }

    if (primaryTotalCount >= primaryMax) {
        primaryTotalCount = primaryMax;
    }
    if (secondaryTotalCount >= secondaryMax) {
        secondaryTotalCount = secondaryMax;
    }

    // --- Tabelle rendern ---
    tableInnerHtml = `
        <tr>
            <th>Primary Enemy (A)</th><th>Count</th>
            <th>Secondary Enemy (B)</th><th>Count</th>
        </tr>
        <tr>
            <td>${chosenPrimary || "-"}</td>
            <td>${primaryTotalCount}</td>
            <td>${chosenSecondary || "-"}</td>
            <td>${secondaryTotalCount}</td>
        </tr>
    `;

    machineList.innerHTML = tableInnerHtml;
    levelIndicator.innerHTML = "Encounter Level: " + encounterLevel;
    renderDifficultyBar(diff);
}

function generateEncounterBriefV5() {
    createMachineDefinitions();

    const levelIndicator = document.getElementById("encounterLevel");
    const machineList = document.getElementById("machineList");
    let tableInnerHtml = "";

    // --- Level zufällig bestimmen ---
    if (document.getElementById("lvl4").checked && document.getElementById("lvl5").checked) {
        encounterLevel = Math.floor(Math.random() * 5) + 1; // 1-5
    } else if (document.getElementById("lvl4").checked) {
        encounterLevel = Math.floor(Math.random() * 4) + 1; // 1-4
    } else if (document.getElementById("lvl5").checked) {
        encounterLevel = Math.floor(Math.random() * 5) + 1;
        if (encounterLevel === 4) encounterLevel = 3;
    } else {
        encounterLevel = Math.floor(Math.random() * 3) + 1;
    }

    const is12Players = document.getElementById("1-2").checked;
    const is34Players = document.getElementById("3-4").checked;
    const spawnFactor = is12Players ? 1 : (is34Players ? 2 : 1);

    chosenPrimary = null;
    chosenSecondary = null;
    let primaryTotalCount = 0;
    let secondaryTotalCount = 0;
    const enemyDiffs = [];

    const usedMachinesCount = {};

    // Gültige Maschinen für das Level vorbereiten
    const validMachines = machineDefinitions.map(def => {
        const [nameType, levelData] = def.split(":");
        const parts = nameType.split(".");
        const name = parts.slice(0, -3).join(".");
        const amount = parseInt(parts[parts.length - 3], 10);
        const difficultyModifier = parseInt(parts[parts.length - 2], 10);
        const shared = parts[parts.length - 1];
        const levels = levelData.split(";").map(v => {
            const nums = v.replace(/[()]/g, "").split(",");
            return { primary: parseInt(nums[0]) || 0, secondary: parseInt(nums[1]) || 0 };
        });
        return { name, amount, difficultyModifier, shared, levels };
    });

    // --- Primär Enemy ---
    const primaryCandidates = validMachines.filter(m => {
        const levelData = m.levels[encounterLevel - 1] || { primary: 0 };
        const used = usedMachinesCount[m.name] || 0;
        return levelData.primary > 0 && used < m.amount;
    });
    if (primaryCandidates.length > 0) {
        const machine = primaryCandidates[Math.floor(Math.random() * primaryCandidates.length)];
        const levelData = machine.levels[encounterLevel - 1];
        let maxAllowed = Math.min(levelData.primary, machine.amount - (usedMachinesCount[machine.name] || 0));
        const count = Math.min(maxAllowed, spawnFactor);
        if (count > 0) {
            usedMachinesCount[machine.name] = (usedMachinesCount[machine.name] || 0) + count;
            chosenPrimary = machine.name;
            primaryTotalCount = count;
            for (let k = 0; k < count; k++) enemyDiffs.push(machine.difficultyModifier);
        }
    }

    // --- Sekundär Enemy ---
    const secondaryCandidates = validMachines.filter(m => {
        const levelData = m.levels[encounterLevel - 1] || { secondary: 0 };
        const used = usedMachinesCount[m.name] || 0;
        return levelData.secondary > 0 && used < m.amount;
    });
    if (secondaryCandidates.length > 0) {
        const machine = secondaryCandidates[Math.floor(Math.random() * secondaryCandidates.length)];
        const levelData = machine.levels[encounterLevel - 1];
        let maxAllowed = Math.min(levelData.secondary, machine.amount - (usedMachinesCount[machine.name] || 0));
        const count = Math.min(maxAllowed, spawnFactor);
        if (count > 0) {
            usedMachinesCount[machine.name] = (usedMachinesCount[machine.name] || 0) + count;
            chosenSecondary = machine.name;
            secondaryTotalCount = count;
            for (let k = 0; k < count; k++) enemyDiffs.push(machine.difficultyModifier);
        }
    }

    // --- Difficulty berechnen ---
    let diff = 0;
    if (enemyDiffs.length > 0) {
        diff = parseFloat((enemyDiffs.reduce((a, b) => a + b, 0) / enemyDiffs.length).toFixed(2));
    }

    // --- Tabelle rendern ---
    tableInnerHtml = `
        <tr>
            <th>Primary Enemy (A)</th><th>Count</th>
            <th>Secondary Enemy (B)</th><th>Count</th>
        </tr>
        <tr>
            <td>${chosenPrimary || "-"}</td>
            <td>${primaryTotalCount}</td>
            <td>${chosenSecondary || "-"}</td>
            <td>${secondaryTotalCount}</td>
        </tr>
    `;

    console.log("Primary Enemy: " + chosenPrimary + "; Secondary Enemy: " + chosenSecondary);

    machineList.innerHTML = tableInnerHtml;
    levelIndicator.innerHTML = "Encounter Level: " + encounterLevel;
    renderDifficultyBar(diff);

    resources = Math.floor(Math.random() * 6);
    document.getElementById("encounterResources").innerHTML = "Encounter Resources " + resources;
}

function update() {
    maxTiles = 0;

    if (document.getElementById("CG").checked == true) {
        maxTiles += 6;
    }
    if (document.getElementById("SL").checked == true) {
        maxTiles += 6;
    }
    if (document.getElementById("FH").checked == true) {
        maxTiles += 6;
    }
    if (document.getElementById("FW").checked == true) {
        maxTiles += 6;
    }
    if (document.getElementById("SotS").checked == true) {
        maxTiles += 6;
    }

    document.getElementById("tileCount").max = `${maxTiles}`;
}

function generateTerrain() {
    terrainA = getRandomTerrain();
    terrainB = getRandomTerrain();

    if (terrainA == "") {
        document.getElementById("terrainSquare").innerHTML = "Terrain (square symbol) " + "-";
    } else {
        document.getElementById("terrainSquare").innerHTML = "Terrain (square symbol) " + terrainA;
    }
    if (terrainB == "") {
        document.getElementById("terrainTriangle").innerHTML = "Terrain (triangle symbol) " + "-";
    } else {
        document.getElementById("terrainTriangle").innerHTML = "Terrain (triangle symbol) " + terrainB;
    }
}

function generateEncounterCard(withNumbers) {
    //let encounterBriefData = JSON.parse(localStorage.getItem("encounterBriefData") || "{}");
    loadValuesFromStorage();

    // Encounter-Brief vorbereiten
    encounterBriefData = {
        level: encounterLevel,
        players: document.getElementById("1-2").checked ? "1-2" : "3-4",
        primary: chosenPrimary || "-",
        primaryCount: primaryCount || 0,
        secondary: chosenSecondary || "-",
        secondaryCount: secondaryCount || 0,
        dualPrimary: chosenDualPrimary || "-",
        dualPrimaryCount: dualPrimaryCount || 0,
        dualSecondary: chosenDualSecondary || "-",
        dualSecondaryCount: dualSecondaryCount || 0,
        numberOverlay: withNumbers || false
    };
    // In localStorage speichern
    localStorage.setItem("encounterBriefData", JSON.stringify(encounterBriefData));

    // --- Prüfen, ob dual Enemys aktiv oder nötig ---
    const manualDual = document.getElementById("dualEnemys")?.checked || false;
    const hasSecondary = encounterBriefData.secondary && encounterBriefData.secondary !== "-" && encounterBriefData.secondary !== "";
    const isDual = manualDual || hasSecondary;

    // --- Alle Daten in einem Objekt bündeln ---
    const data = {
        encounterBriefData,
        placedTileList,
        resources,
        terrainA,
        terrainB
    };

    
    // JSON → Base64 (URL-sicher)
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));

    // JSON → komprimiert → Base64
    const json = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(json);

    // Copy the text inside the text field
    const target = isDual ? "encounterCardV4.html#dual=" + compressed : "encounterCardV4.html#" + compressed;
    window.open(target, "_blank");
};

function planeGrid(tileDefinitions, tileCount, output, usedTileIds, placedTiles, toPlace, startDef, base, baseX, baseY, baseRot, baseMatrixRot, placedTileList, generationType) {
    let rows = 0;
    let cols = 0;

    if (generationType == "2x2") {
        rows = 2;
        cols = 2;
    } else if (generationType == "3x3") {
        rows = 3;
        cols = 3;
    }

    let basePosition = {
        row: Math.floor(Math.random() * rows) + 1,
        col: Math.floor(Math.random() * cols + 1)
    }

    for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= cols; col++) {
            if (basePosition.row == row && basePosition.col == col) {
                //
            } else {
                //
            }
            
            // Basis-Tile an Position x:9 y:9 bereits generiert

            if (row == 1 && col == cols) {
                //
            } else {
                let rot = Math.floor(Math.random() * 3);

                // Zufälliges, noch ungenutztes Tile wählen
                const unusedTiles = [];
                for (const def of tileDefinitions) {
                    const cand = parseTile(def);
                    if (!usedTileIds.has(cand.id)) unusedTiles.push(cand);
                }
                const newTile = unusedTiles[Math.floor(Math.random() * unusedTiles.length)];
                usedTileIds.add(newTile.id);

                for (const specialTileID of specialTiles) {
                    if (newTile.id == specialTileID) {
                        if (specialTileID == "1K") usedTileIds.add("5K");
                        if (specialTileID == "2K") usedTileIds.add("6K");
                        if (specialTileID == "3K") usedTileIds.add("7K");
                        if (specialTileID == "4K") usedTileIds.add("8K");
                        
                        if (specialTileID == "5K") usedTileIds.add("1K");
                        if (specialTileID == "6K") usedTileIds.add("2K");
                        if (specialTileID == "7K") usedTileIds.add("3K");
                        if (specialTileID == "8K") usedTileIds.add("4K");
                    }
                }

                // Rotierte Matrix des neuen Tiles bestimmen
                let rotTileMatrix = newTile.matrix;
                if (rot === 1) rotTileMatrix = rotateMatrix(newTile.matrix, 90);
                else if (rot === 2) rotTileMatrix = rotateMatrix(newTile.matrix, 180);
                else if (rot === 3) rotTileMatrix = rotateMatrix(newTile.matrix, 270);

                // globale Position bestimmen
                let xPosGlob = 0;
                let yPosGlob = 0;
                if (row == 1) {
                    xPosGlob = 9 + (col * 3);
                } else {
                    xPosGlob = 6 + (col * 3);
                }
                yPosGlob = 6 + (row * 3);

                // Tile platzieren
                output.appendChild(createTileElement(newTile, rot, xPosGlob, yPosGlob));
                occupyCells(newTile.id, rotTileMatrix, rot, xPosGlob, yPosGlob);
                placedTileList.push({ tile: newTile, x: xPosGlob, y: yPosGlob, rot, matrix: rotTileMatrix });
            }
        }
    }
}

function copyLink(withNumbers) {
    // encounterBoard & encounterBrief speichern
    //localStorage.setItem("encounterBoardHTML", document.getElementById("output").innerHTML);
    //localStorage.setItem("encounterBriefHTML", document.getElementById("encounterBrief").innerHTML);
    // Level + Spieleranzahl extra speichern
    //localStorage.setItem("encounterLevel", encounterLevel);
    //localStorage.setItem("players", document.getElementById("1-2").checked ? "1-2" : "3-4");

    numberOverlay = withNumbers;

    saveValuesToStorage();

    // neue Seite öffnen
    //window.open("encounterCardV2.html", "_blank");

    // Alle Daten, die du übergeben willst, zusammenfassen
    encounterBriefData = JSON.parse(localStorage.getItem("encounterBriefData") || "{}");
    // --- Prüfen, ob dual Enemys aktiv oder nötig ---
    const manualDual = document.getElementById("dualEnemys")?.checked || false;
    const hasSecondary = encounterBriefData.secondary && encounterBriefData.secondary !== "-" && encounterBriefData.secondary !== "";
    const isDual = manualDual || hasSecondary;
    const data = {
        encounterBriefData,
        placedTileList,
        resources,
        terrainA,
        terrainB
    };

    // JSON → Base64 (URL-sicher)
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));

    // JSON → komprimiert → Base64
    const json = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(json);

    // Copy the text inside the text field
    const target = isDual ? "encounterCardV4.html#dual=" + compressed : "encounterCardV4.html#" + compressed;
    navigator.clipboard.writeText(`encounterCardV3.html#${target}`);

    // Alert the copied text
    alert("Copied Encounter Card link");
}

function generateEncounterBriefV6() {
    chosenPrimary = null;
    chosenSecondary = null;
    chosenDualPrimary = null;
    chosenDualSecondary = null;

  createMachineDefinitions();

  const levelIndicator = document.getElementById("encounterLevel");
  const machineList = document.getElementById("machineList");
  let tableInnerHtml = "";

  // --- Level zufällig bestimmen ---
  if (document.getElementById("lvl4").checked && document.getElementById("lvl5").checked) {
    encounterLevel = Math.floor(Math.random() * 5) + 1; // 1–5
  } else if (document.getElementById("lvl4").checked) {
    encounterLevel = Math.floor(Math.random() * 4) + 1; // 1–4
  } else if (document.getElementById("lvl5").checked) {
    encounterLevel = Math.floor(Math.random() * 5) + 1;
    if (encounterLevel === 4) encounterLevel = 3;
  } else {
    encounterLevel = Math.floor(Math.random() * 3) + 1; // 1–3
  }

  const is12Players = document.getElementById("1-2").checked;
  const is34Players = document.getElementById("3-4").checked;
  const spawnFactor = is12Players ? 1 : (is34Players ? 2 : 1);
  const dualEnabled = document.getElementById("dualEnemys").checked;

  const usedMachinesCount = {};
  const chosenPrimaries = [];
  const chosenSecondaries = [];
  const enemyDiffs = [];

  // --- Maschinen vorbereiten ---
  const validMachines = machineDefinitions.map(def => {
    const [nameType, levelData] = def.split(":");
    const parts = nameType.split(".");
    const name = parts.slice(0, -3).join(".");
    const amount = parseInt(parts[parts.length - 3], 10);
    const difficultyModifier = parseInt(parts[parts.length - 2], 10);
    const shared = parts[parts.length - 1];
    const levels = levelData.split(";").map(v => {
      const nums = v.replace(/[()]/g, "").split(",");
      return { primary: parseInt(nums[0]) || 0, secondary: parseInt(nums[1]) || 0 };
    });
    return { name, amount, difficultyModifier, shared, levels };
  });

  function pickEnemy(type) {
    const candidates = validMachines.filter(m => {
      const levelData = m.levels[encounterLevel - 1] || {};
      const used = usedMachinesCount[m.name] || 0;
      const value = type === "primary" ? levelData.primary : levelData.secondary;
      return value > 0 && used < m.amount;
    });
    if (candidates.length === 0) return null;

    const machine = candidates[Math.floor(Math.random() * candidates.length)];
    const levelData = machine.levels[encounterLevel - 1];
    const value = type === "primary" ? levelData.primary : levelData.secondary;
    let maxAllowed = Math.min(value, machine.amount - (usedMachinesCount[machine.name] || 0));
    const count = Math.min(maxAllowed, spawnFactor);
    if (count > 0) {
      usedMachinesCount[machine.name] = (usedMachinesCount[machine.name] || 0) + count;
      for (let k = 0; k < count; k++) enemyDiffs.push(machine.difficultyModifier);
      return { name: machine.name, count };
    }
    return null;
  }

  // --- Primär/Sekundär Enemy auswählen ---
  const primary1 = pickEnemy("primary");
  chosenPrimary = primary1.name;
  primaryCount = primary1.count;
  const secondary1 = pickEnemy("secondary");
  chosenSecondary = secondary1.name;
  secondaryCount = secondary1.count;
  if (primary1) chosenPrimaries.push(primary1);
  if (secondary1) chosenSecondaries.push(secondary1);

  // --- Bei dualEnemys Checkbox: zweite Auswahl ---
  if (dualEnabled) {
    const primary2 = pickEnemy("primary");
    chosenDualPrimary = primary2.name;
    dualPrimaryCount = primary2.count;
    const secondary2 = pickEnemy("secondary");
    chosenDualSecondary = secondary2.name;
    dualSecondaryCount = secondary2.count;
    if (primary2) chosenPrimaries.push(primary2);
    if (secondary2) chosenSecondaries.push(secondary2);
  }

  // --- Difficulty berechnen ---
  let diff = 0;
  if (enemyDiffs.length > 0)
    diff = parseFloat((enemyDiffs.reduce((a, b) => a + b, 0) / enemyDiffs.length).toFixed(2));

  // --- Tabelle rendern ---
  tableInnerHtml = `
    <tr>
      <th>Primary Enemy (A)</th><th>Count</th>
      <th>Secondary Enemy (B)</th><th>Count</th>
    </tr>
  `;

  const maxRows = Math.max(chosenPrimaries.length, chosenSecondaries.length);
  for (let i = 0; i < maxRows; i++) {
    const p = chosenPrimaries[i] || { name: "-", count: "-" };
    const s = chosenSecondaries[i] || { name: "-", count: "-" };
    tableInnerHtml += `
      <tr>
        <td>${p.name}</td><td>${p.count}</td>
        <td>${s.name}</td><td>${s.count}</td>
      </tr>
    `;
  }

  machineList.innerHTML = tableInnerHtml;
  levelIndicator.innerHTML = "Encounter Level: " + encounterLevel;
  renderDifficultyBar(diff);

  // --- Resources ---
  resources = Math.floor(Math.random() * 6);
  document.getElementById("encounterResources").innerHTML = "Encounter Resources " + resources;

  saveValuesToStorage();
}
