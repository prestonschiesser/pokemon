// -------------------------------
// Utilities
// -------------------------------
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function printText(text) {
    const area = document.getElementById("text-area");
    area.innerHTML = "";
    for (let i = 0; i < text.length; i++) {
        area.innerHTML += text[i];
        await sleep(15);
    }
}

function hpBar(current, max) {
    const totalBars = 10;
    const filled = Math.floor(current / max * totalBars);
    return "HP: [" + "█".repeat(filled) + "░".repeat(totalBars - filled) + "]";
}

// -------------------------------
// Classes
// -------------------------------
class Move {
    constructor(name, type, power=0, effect=null, levelLearned=1) {
        this.name = name;
        this.type = type;
        this.power = power;
        this.effect = effect;
        this.levelLearned = levelLearned;
    }
}

class Pokemon {
    constructor(name, type, level, maxHP, attack, defense, speed, moves, evolution=null, evolvedName=null) {
        this.name = name;
        this.type = type;
        this.level = level;
        this.maxHP = maxHP;
        this.currentHP = maxHP;
        this.attack = attack;
        this.defense = defense;
        this.speed = speed;
        this.moves = moves;
        this.evolution = evolution;
        this.evolvedName = evolvedName;
        this.status = null;
    }
    learnMoves() {
        this.moves.forEach(move=>{
            if(this.level >= move.levelLearned) {
                if(!this.moves.includes(move)) this.moves.push(move);
            }
        });
    }
    levelUpCheck() {
        if(this.evolution && this.level >= this.evolution) {
            printText(`${this.name} is evolving into ${this.evolvedName}!`);
            this.name = this.evolvedName;
            this.maxHP += 20;
            this.currentHP = this.maxHP;
            this.attack += 10;
            this.defense += 10;
            this.speed += 5;
        }
    }
}

// -------------------------------
// Pokémon Data
// -------------------------------
const rabgrassMoves = [
    new Move("Tackle","Grass",10, null,1),
    new Move("Growl","Normal",0, {stat:"attack",change:-1},3),
    new Move("Vine Whip","Grass",12,null,4),
    new Move("Spore","Grass",0,{status:"sleep"},8),
    new Move("Grass Knot","Grass",15,null,14)
];
const rabgrass = new Pokemon("Rabgrass","Grass",5,50,20,35,15,rabgrassMoves,15,"Bloombit");

const loonwaveMoves = [
    new Move("Tackle","Normal",10,null,1),
    new Move("Growl","Normal",0,{stat:"attack",change:-1},3),
    new Move("Water Gun","Water",12,null,1)
];
const loonwave = new Pokemon("Loonwave","Water",5,50,18,15,15,loonwaveMoves,16,"Superloon");

const squirrelcampMoves = [
    new Move("Quick Attack","Normal",10,null,1),
    new Move("Ember","Fire",12,null,1),
    new Move("Leer","Normal",0,{stat:"defense",change:-1},3)
];
const squirrelcamp = new Pokemon("Squirrelcamp","Fire",5,50,20,15,16,squirrelcampMoves,16,"Bonsquirrel");

const vultackMoves = [
    new Move("Peck","Flying",10,null,1),
    new Move("Growl","Normal",0,{stat:"attack",change:-1},3),
    new Move("Quick Attack","Normal",12,null,6)
];
const vultack = new Pokemon("Vultack","Flying/Ghost",5,40,14,8,12,vultackMoves,18,"Talongrave");

// Wild Pokémon examples
const buckbudMoves = [new Move("Tackle","Normal",10,null,1)];
const buckbud = new Pokemon("Buckbud","Normal/Grass",5,40,15,10,12,buckbudMoves,20,"Electrabuck");

const leachqitoMoves = [new Move("Leech Life","Bug",8,null,1), new Move("Absorb","Grass",6,null,1), new Move("Poison Powder","Poison",0,{status:"poison"},1)];
const leachqito = new Pokemon("Leachqito","Bug/Dark",5,30,10,5,10,leachqitoMoves);

const flambugMoves = [new Move("Ember","Fire",10,null,1)];
const flambug = new Pokemon("Flambug","Fire/Bug",5,30,12,8,10,flambugMoves);

// -------------------------------
// Pokedex
// -------------------------------
const allPokemon = [
    {number: 1, name: "Rabgrass"},
    {number: 2, name: "Bloombit"},
    {number: 3, name: "Rabkin"},
    {number: 4, name: "Loonwave"},
    {number: 5, name: "Superloon"},
    {number: 6, name: "Squirrelcamp"},
    {number: 7, name: "Bonsquirrel"},
    {number: 8, name: "Vultack"},
    {number: 9, name: "Talongrave"},
    {number: 10, name: "Buckbud"},
    {number: 11, name: "Electrabuck"},
    {number: 12, name: "Leachqito"},
    {number: 13, name: "Flambug"}
];
let pokedexSeen = [];
let pokedexCaught = [];

async function showPokedex() {
    const menu = document.getElementById("menu-buttons");
    menu.innerHTML = "";
    let text = "Pokédex:\n";
    allPokemon.forEach(poke=>{
        if(pokedexSeen.includes(poke.name)){
            let status = pokedexCaught.includes(poke.name) ? "Caught" : "Seen";
            text += `${poke.number}. ${poke.name} [${status}]\n`;
        } else {
            text += `${poke.number}. ???\n`;
        }
    });
    await printText(text);
    let backBtn = document.createElement("button");
    backBtn.innerText = "Back";
    backBtn.onclick = ()=>{menu.innerHTML = "";};
    menu.appendChild(backBtn);
}

// -------------------------------
// Player
// -------------------------------
let playerParty = [];
let inventory = {"Potion":5,"Pokeball":5};

// -------------------------------
// Game Flow
// -------------------------------
async function startGame() {
    await printText("You wake up in Wood Falls, the morning sun warms your room.");
    await chooseStarter();
}

async function chooseStarter() {
    const menu = document.getElementById("menu-buttons");
    menu.innerHTML = "";
    let starters = [rabgrass, loonwave, squirrelcamp];
    await printText("Choose your starter Pokémon:");
    starters.forEach((poke,index)=>{
        let btn = document.createElement("button");
        btn.innerText = `${poke.name} (${poke.type}) Lv${poke.level}`;
        btn.onclick = async ()=>{
            playerParty.push(poke);
            pokedexSeen.push(poke.name);
            menu.innerHTML = "";
            await printText(`You chose ${poke.name}!`);
            startRivalBattle(poke);
        };
        menu.appendChild(btn);
    });
}

async function startRivalBattle(playerPoke) {
    let rival;
    if(playerPoke.name==="Rabgrass") rival = loonwave;
    else if(playerPoke.name==="Loonwave") rival = squirrelcamp;
    else rival = rabgrass;
    pokedexSeen.push(rival.name);
    await printText(`Your rival John Johnson picked ${rival.name}!`);
    await printText(`John Johnson challenges you to battle!`);
    // placeholder for battle system
}

// -------------------------------
// Start
// -------------------------------
startGame();
