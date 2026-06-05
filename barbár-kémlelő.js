// ==UserScript==
// @name         barbár kémlelő
// @namespace    WarriorSpirit
// @version      2.0
// @description  try to take over the world!
// @author       -Sam, edited by WarriorSpirit
// @include      https://*/game.php?village=*&screen=map*
// @run-at       document-idle
// ==/UserScript==
var kemlelo = {};
var minPoints = 26;
var maxPoints = 12154;
var radius = 30;
var csoporthossz = 50;
kemlelo.minPoints = minPoints;
kemlelo.maxPoints = maxPoints;
kemlelo.radius = radius;
kemlelo.csoporthossz = csoporthossz;
var currentVillage = game_data.village.coord;
if(localStorage.getItem("Sam_kemlelo") === null || localStorage.getItem("Sam_kemlelo") === "NaN" ){ localStorage.setItem("Sam_kemlelo", JSON.stringify(kemlelo));}
else {kemlelo = JSON.parse(localStorage.getItem("Sam_kemlelo"));}
///////////////////////////////////////////////////////
var coords = [];
var sereg = {};
async function find_barb(){
    var nearest_coordi = barb_finder();
    async function barb_finder(){
        var villages = [];
        var barbarians = [];
        var filteredByRadiusBarbs;
        var barbariansWithDistance = [];
        var map_barb;
        var this_world = game_data.world;
        var this_player = game_data.player.name;
        var this_worldmap_localstorage = "map_data" + this_player +this_world;

        fetchVillagesData();

        async function fetchVillagesData() {
            $.get('map/village.txt', function (data) {
                villages = CSVToArray(data);
            })
                .done(function () {
                findBarbarianVillages();
            })
        }

        async function findBarbarianVillages() {
            villages.forEach((village) => {
                if (village[4] == '0') {
                    barbarians.push(village);
                }
            });
            await filterBarbs();
        }

        async function filterBarbs() {

            // Filter by min and max points
            var filteredBarbs = barbarians.filter((barbarian) => {
                return barbarian[5] >= minPoints && barbarian[5] <= maxPoints;
            });

            // Filter by radius
            filteredByRadiusBarbs = filteredBarbs.filter((barbarian) => {
                var barbCoord = barbarian[2] + '|' + barbarian[3];
                var distance = calculateDistance(currentVillage, barbCoord);
                if (distance <= radius) {
                    return barbarian;
                }
            });
            await generateBarbariansTable(filteredByRadiusBarbs, currentVillage);
            var map_barb_x, map_barb_y, map_barb_coord;
            for (let i = 0; i<barbariansWithDistance.length; i++){
                map_barb_x = +barbariansWithDistance[i][2];
                map_barb_y = +barbariansWithDistance[i][3];
                map_barb_coord = map_barb_x + "|" + map_barb_y;
                coords.push(map_barb_coord);
            }
            function* chunks(arr, n) {
                for (let i = 0; i < arr.length; i += n) {
                    yield arr.slice(i, i + n);
                }
            }
            coords = ([...chunks(coords, csoporthossz)]);
            createInput();
            createSettings();
        }
        // line up barbs by distance
        function generateBarbariansTable(barbs, currentVillage) {
            barbs.forEach((barb) => {
                var barbCoord = barb[2] + '|' + barb[3];
                var distance = calculateDistance(currentVillage, barbCoord);
                barbariansWithDistance.push([...barb, distance]);
            });

            barbariansWithDistance.sort((a, b) => {
                return a[7] - b[7];
            });
        }
        // Helper: Calculate distance between 2 villages
        function calculateDistance(from, to) {
            var [x1, y1] = from.split('|');
            var [x2, y2] = to.split('|');
            var deltaX = Math.abs(x1 - x2);
            var deltaY = Math.abs(y1 - y2);
            let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            distance = distance.toFixed(2);
            return distance;
        }
        // Helper: Get Villages Coords Array
        function getVillageCoord(villages) {
            var villageCoords = [];
            villages.forEach((village) => {
                villageCoords.push(village[2] + '|' + village[3]);
            });
            return villageCoords;
        }
        //Helper: Convert CSV data into Array
        function CSVToArray(strData, strDelimiter) {
            strDelimiter = strDelimiter || ',';
            var objPattern = new RegExp(
                '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' + '(?:"([^"]*(?:""[^"]*)*)"|' + '([^"\\' + strDelimiter + '\\r\\n]*))',
                'gi'
            );
            var arrData = [[]];
            var arrMatches = null;
            while ((arrMatches = objPattern.exec(strData))) {
                var strMatchedDelimiter = arrMatches[1];
                if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
                    arrData.push([]);
                }
                var strMatchedValue;

                if (arrMatches[2]) {
                    strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
                } else {
                    strMatchedValue = arrMatches[3];
                }
                arrData[arrData.length - 1].push(strMatchedValue);
            }
            return arrData;
        }
    }
}
for (let i=0; i<game_data.units.length; i++){
    var unnit = game_data.units[i];
    if (unnit === "spear"){sereg.spear = "";}
    if (unnit === "sword"){sereg.sword = "";}
    if (unnit === "axe"){sereg.axe = ""}
    if (unnit === "archer"){sereg.archer = ""}
    if (unnit === "spy"){sereg.spy = ""}
    if (unnit === "light"){sereg.light = ""}
    if (unnit === "marcher"){sereg.marcher = ""}
    if (unnit === "heavy"){sereg.heavy = ""}
    if (unnit === "ram"){sereg.ram = ""}
    if (unnit === "catapult"){sereg.catapult = ""}
    if (unnit === "knight"){sereg.knight = ""}
    if (unnit === "snob"){sereg.snob = ""}
}
sereg.spy = 1;
async function start_spy(group){
    var innen_tamad = +game_data.village.id;
    var ezt_tamad_coordd = coords[group];
    var delay = Math.floor((Math.random()*1000)+1200);
    setTimeout(tamad_setup, delay);
    async function tamad_setup(){
        if (ezt_tamad_coordd.length > 0){
            var ezt_tamad_coord = ezt_tamad_coordd[0];
            console.log(ezt_tamad_coord)
            console.log(+ezt_tamad_coord.split("|")[0], +ezt_tamad_coord.split("|")[1])
            var ezt_tamad_x = +ezt_tamad_coord.split("|")[0];
            var ezt_tamad_y = +ezt_tamad_coord.split("|")[1];
            attack(ezt_tamad_x,ezt_tamad_y,sereg,"main");
            ezt_tamad_coordd.shift();
            var delay = Math.floor((Math.random()*1000)+1200);
            setTimeout(tamad_setup, delay);
        }
        else {UI.SuccessMessage("Minden támadás kiküldve!");}
    }
}
async function attack(x,y,sereg){
    var xa = x;
    var ya = y;
    async function getKey() {
        $.get("game.php?village=" + game_data.village.id + "&screen=place", function(response) {
            var parser = new DOMParser();
            var dom = parser.parseFromString(response, "text/html");
            var key = dom.querySelector("#command-data-form > input:nth-child(1)").getAttribute("name");
            var value = dom.querySelector("#command-data-form > input:nth-child(1)").value;
            var attack_name = dom.getElementById("target_attack").value;
            var support_name = dom.getElementById("target_support").value;
            prep_attack(key,value,attack_name);
        })}
    getKey();
    async function prep_attack(key,value) {
        var keya = key;
        var valuea = value;
        if(sereg.spear !== undefined){if(sereg.spear === 0){sereg.spear = "";}}
        if(sereg.sword !== undefined){if(sereg.sword === 0){sereg.sword = "";}}
        if(sereg.axe !== undefined){if(sereg.axe === 0){sereg.axe = "";}}
        if(sereg.archer !== undefined){if(sereg.archer === 0){sereg.archer = "";}}
        if(sereg.spy !== undefined){if(sereg.spy === 0){sereg.spy = "";}}
        if(sereg.light !== undefined){if(sereg.light === 0){sereg.light = "";}}
        if(sereg.marcher !== undefined){if(sereg.marcher === 0){sereg.marcher = "";}}
        if(sereg.heavy !== undefined){if(sereg.heavy === 0){sereg.heavy = "";}}
        if(sereg.ram !== undefined){if(sereg.ram === 0){sereg.ram = "";}}
        if(sereg.catapult !== undefined){if(sereg.catapult === 0){sereg.catapult = "";}}
        if(sereg.knight !== undefined){if(sereg.knight === 0){sereg.knight = "";}}
        if(sereg.snob !== undefined){if(sereg.snob === 0){sereg.snob = "";}}
        // Form data for entering the attack dialog
        var data = [];
        data.push({ name: "" + key, value: "" + value});
        data.push({ name: "template_id", value: "" });
        data.push({ name: "source_village", value: "" + game_data.village.id });
        if(sereg.spear !== undefined){data.push({ name: "spear", value: "" + sereg.spear });}
        if(sereg.sword !== undefined){data.push({ name: "sword", value: "" + sereg.sword });}
        if(sereg.axe !== undefined){data.push({ name: "axe", value: "" + sereg.axe });}
        if(sereg.archer !== undefined){data.push({ name: "archer", value: "" + sereg.archer });}
        if(sereg.spy !== undefined){data.push({ name: "spy", value: "" + sereg.spy });}
        if(sereg.light !== undefined){data.push({ name: "light", value: "" + sereg.light });}
        if(sereg.marcher !== undefined){data.push({ name: "marcher", value: "" + sereg.marcher });}
        if(sereg.heavy !== undefined){data.push({ name: "heavy", value: "" + sereg.heavy });}
        if(sereg.ram !== undefined){data.push({ name: "ram", value: "" + sereg.ram });}
        if(sereg.catapult !== undefined){data.push({ name: "catapult", value: "" + sereg.catapult });}
        if(sereg.knight !== undefined){data.push({ name: "knight", value: "" + sereg.knight });}
        if(sereg.snob !== undefined){data.push({ name: "snob", value: "" + sereg.snob });}
        data.push({ name: "x", value: "" + xa });
        data.push({ name: "y", value: "" + ya });
        data.push({ name: "input", value: "" });
        data.push({ name: "attack", value: "l"});
        //data.push({ name: "h", value: game_data.csrf});

        TribalWars.post("place", {ajax: "confirm"}, data, function(response) {
            if (response.dialog.includes('name="ch" value="')){
                var ch = response.dialog.split('name="ch" value="')[1].split('" />')[0];
                sendAttack(ch,sereg);
            } else {
                UI.ErrorMessage("Nincs elegendő sereg!" );
            }
        });
    }
    async function sendAttack(ch,sereg) {
        if(sereg.spear !== undefined){if(sereg.spear === ""){sereg.spear = 0;}}
        if(sereg.sword !== undefined){if(sereg.sword === ""){sereg.sword = 0;}}
        if(sereg.axe !== undefined){if(sereg.axe === ""){sereg.axe = 0;}}
        if(sereg.archer !== undefined){if(sereg.archer === ""){sereg.archer = 0;}}
        if(sereg.spy !== undefined){if(sereg.spy === ""){sereg.spy = 0;}}
        if(sereg.light !== undefined){if(sereg.light === ""){sereg.light = 0;}}
        if(sereg.marcher !== undefined){if(sereg.marcher === ""){sereg.marcher = 0;}}
        if(sereg.heavy !== undefined){if(sereg.heavy === ""){sereg.heavy = 0;}}
        if(sereg.ram !== undefined){if(sereg.ram === ""){sereg.ram = 0;}}
        if(sereg.catapult !== undefined){if(sereg.catapult === ""){sereg.catapult = 0;}}
        if(sereg.knight !== undefined){if(sereg.knight === ""){sereg.knight = 0;}}
        if(sereg.snob !== undefined){if(sereg.snob === ""){sereg.snob = 0;}}

        // Form data to confirm attack, needs to be duplicated due to different order (ban prevention)
        var data = [];
        data.push({ name: "attack", value: "" + true});
        data.push({ name: "ch", value: "" + ch });
        data.push({ name: "cb", value: "troop_confirm_submit" });
        data.push({ name: "x", value: "" + xa });
        data.push({ name: "y", value: "" + ya });
        data.push({ name: "source_village", value: "" + game_data.village.id });
        data.push({ name: "village", value: "" + game_data.village.id });
        data.push({ name: "attack_name", value: "" });
        if(sereg.spear !== undefined){data.push({ name: "spear", value: "" + sereg.spear });}
        if(sereg.sword !== undefined){data.push({ name: "sword", value: "" + sereg.sword });}
        if(sereg.axe !== undefined){data.push({ name: "axe", value: "" + sereg.axe });}
        if(sereg.archer !== undefined){data.push({ name: "archer", value: "" + sereg.archer });}
        if(sereg.spy !== undefined){data.push({ name: "spy", value: "" + sereg.spy });}
        if(sereg.light !== undefined){data.push({ name: "light", value: "" + sereg.light });}
        if(sereg.marcher !== undefined){data.push({ name: "marcher", value: "" + sereg.marcher });}
        if(sereg.heavy !== undefined){data.push({ name: "heavy", value: "" + sereg.heavy });}
        if(sereg.ram !== undefined){data.push({ name: "ram", value: "" + sereg.ram });}
        if(sereg.catapult !== undefined){data.push({ name: "catapult", value: "" + sereg.catapult });}
        if(sereg.knight !== undefined){data.push({ name: "knight", value: "" + sereg.knight });}
        if(sereg.snob !== undefined){data.push({ name: "snob", value: "" + sereg.snob });}
        data.push({ name: "building", value: "main" });
        data.push({ name: "h", value: "" + game_data.csrf});
        //data.push({ name: "h", value: game_data.csrf});

        TribalWars.post("place", {ajaxaction: "popup_command"}, data, function(response) {
            if (response.message.length > 0) {
                UI.SuccessMessage("Támadás sikeresen elküldve!");
            } else {
            }
        });
    }
}
function createInput() {
    var xaxa = "";
    for(let i=0; i<coords.length; i++){
        var yaya = i+1;
        xaxa = xaxa + "<button id='start'name='start_'class='btn'>csoport "+ yaya + " támadása</button>"
    }
    document.getElementById("divScript").innerHTML = "<p>" + xaxa + "</p>";
    load_buttons();
}
function load_buttons(){
    var buttons = document.getElementsByName("start_");
    for(let i=0; i<buttons.length; i++){
        buttons[i].addEventListener("click", function () {
            start_spy(i);
        })
    }
}
function createSettings() {
    var userInputParent0 = document.getElementById("map_big"); // Parent element
    var divScript0 = document.createElement("div");
    divScript0.setAttribute("id", "divScript");
    userInputParent0.parentNode.insertBefore(divScript0, userInputParent0);
    var userInputParent = document.getElementById("divScript"); // Parent element
    var divScript = document.createElement("div");
    divScript.setAttribute("id", "divScript1");
    userInputParent.parentNode.insertBefore(divScript, userInputParent);
    document.getElementById("divScript1").innerHTML = "<p>Minimum pont: <input id='Min_pont'> Maximum pont: <input id='Max_pont'></p><p>Távolság: <input id='Max_tav'> csoporthossz: <input id='Csop_hossz'></p><p><button id='start_generate' class='btn'>Lista generálása</button> </p>";
    loadSettings();
    document.getElementById("start_generate").addEventListener("click", function () {
        minPoints = +document.getElementById("Min_pont").value;
        maxPoints = +document.getElementById("Max_pont").value;
        radius = +document.getElementById("Max_tav").value;
        csoporthossz = +document.getElementById("Csop_hossz").value;
        kemlelo.minPoints = minPoints;
        kemlelo.maxPoints = maxPoints;
        kemlelo.radius = radius;
        kemlelo.csoporthossz = csoporthossz;
        localStorage.setItem("Sam_kemlelo", JSON.stringify(kemlelo));
        find_barb();
    });
}
function loadSettings(){
    document.getElementById("Min_pont").value = kemlelo.minPoints;
    document.getElementById("Max_pont").value = kemlelo.maxPoints;
    document.getElementById("Max_tav").value = kemlelo.radius;
    document.getElementById("Csop_hossz").value = kemlelo.csoporthossz;
}
createSettings();
