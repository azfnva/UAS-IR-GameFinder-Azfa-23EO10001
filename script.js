let games = [];
let idfWeights = {}; // 💡 Untuk menyimpan bobot IDF setiap kata di dataset

// Daftar kata-kata buang yang tidak memiliki bobot informasi penting
const stopwords = new Set([
    "with", "and", "of", "in", "an", "a", "the", "to", "for", "on", "by", "is", "at", "from"
]);

const gameImages = {
  // --- FPS & Battle Royale ---
  "Valorant": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2080160/header.jpg",
  "Counter Strike 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
  "Apex Legends": "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",
  "Fortnite": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2177510/header.jpg",
  "PUBG Battlegrounds": "https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg",
  "Call of Duty Warzone": "https://cdn.cloudflare.steamstatic.com/steam/apps/1962660/header.jpg",
  "Rainbow Six Siege": "https://cdn.cloudflare.steamstatic.com/steam/apps/359550/header.jpg",
  "Overwatch 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/2357570/header.jpg",
  "Battlefield 2042": "https://cdn.cloudflare.steamstatic.com/steam/apps/1517290/header.jpg",
  "Escape From Tarkov": "https://placehold.co/460x215/1e293b/38bdf8?text=Escape+From+Tarkov",

  // --- Sandbox & Survival ---
  "Minecraft": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1672740/header.jpg",
  "Terraria": "https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg",
  "Rust": "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg",
  "The Forest": "https://cdn.cloudflare.steamstatic.com/steam/apps/242760/header.jpg",
  "Sons of the Forest": "https://cdn.cloudflare.steamstatic.com/steam/apps/1326470/header.jpg",
  "ARK Survival Ascended": "https://cdn.cloudflare.steamstatic.com/steam/apps/2390490/header.jpg",
  "Palworld": "https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg",
  "Subnautica": "https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg",
  "Valheim": "https://cdn.cloudflare.steamstatic.com/steam/apps/892970/header.jpg",
  "No Mans Sky": "https://cdn.cloudflare.steamstatic.com/steam/apps/275850/header.jpg",

  // --- Open World & RPG ---
  "Genshin Impact": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2340350/header.jpg",
  "Wuthering Waves": "https://placehold.co/460x215/1e293b/38bdf8?text=Wuthering+Waves",
  "Honkai Star Rail": "https://placehold.co/460x215/1e293b/38bdf8?text=Honkai+Star+Rail",
  "Elden Ring": "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
  "The Witcher 3": "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
  "Cyberpunk 2077": "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
  "Skyrim": "https://cdn.cloudflare.steamstatic.com/steam/apps/489830/header.jpg",
  "Dragon Age Inquisition": "https://cdn.cloudflare.steamstatic.com/steam/apps/1222690/header.jpg",
  "Baldurs Gate 3": "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
  "Persona 5 Royal": "https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/header.jpg",

  // --- Action Adventure & Zombie ---
  "Red Dead Redemption 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/1142710/header.jpg",
  "Grand Theft Auto V": "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
  "Watch Dogs 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/447040/header.jpg",
  "Assassins Creed Valhalla": "https://cdn.cloudflare.steamstatic.com/steam/apps/2208920/header.jpg",
  "Ghost of Tsushima": "https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/header.jpg",
  "Days Gone": "https://cdn.cloudflare.steamstatic.com/steam/apps/1259420/header.jpg",
  "Dying Light 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/534380/header.jpg",
  "State of Decay 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/490850/header.jpg",
  "Project Zomboid": "https://cdn.cloudflare.steamstatic.com/steam/apps/108600/header.jpg",
  "Dead Island 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/1234040/header.jpg",

  // --- MOBA & Sports ---
  "League of Legends": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2048540/header.jpg",
  "Dota 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg",
  "Mobile Legends": "https://placehold.co/460x215/1e293b/38bdf8?text=Mobile+Legends",
  "Smite": "https://cdn.cloudflare.steamstatic.com/steam/apps/386360/header.jpg",
  "Heroes of the Storm": "https://placehold.co/460x215/1e293b/38bdf8?text=Heroes+of+the+Storm",
  "Rocket League": "https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg",
  "EA Sports FC 26": "https://placehold.co/460x215/1e293b/38bdf8?text=EA+Sports+FC+26",
  "eFootball": "https://cdn.cloudflare.com/steam/apps/1665460/header.jpg",

  // --- Racing & Simulation ---
  "Forza Horizon 5": "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg",
  "Need for Speed Heat": "https://cdn.cloudflare.steamstatic.com/steam/apps/1222680/header.jpg",
  "Assetto Corsa": "https://cdn.cloudflare.steamstatic.com/steam/apps/244210/header.jpg",
  "Gran Turismo 7": "https://placehold.co/460x215/1e293b/38bdf8?text=Gran+Turismo+7",
  "F1 25": "https://placehold.co/460x215/1e293b/38bdf8?text=F1+25",
  "Euro Truck Simulator 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/227300/header.jpg",
  "American Truck Simulator": "https://cdn.cloudflare.steamstatic.com/steam/apps/270880/header.jpg",
  "Microsoft Flight Simulator": "https://cdn.cloudflare.steamstatic.com/steam/apps/1250410/header.jpg",

  // --- Simulation & Strategy ---
  "Stardew Valley": "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg",
  "Animal Crossing New Horizons": "https://placehold.co/460x215/1e293b/38bdf8?text=Animal+Crossing",
  "The Sims 4": "https://cdn.cloudflare.steamstatic.com/steam/apps/1222670/header.jpg",
  "Cities Skylines": "https://cdn.cloudflare.steamstatic.com/steam/apps/255710/header.jpg",
  "Cities Skylines 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/949230/header.jpg",
  "Civilization VI": "https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg",
  "Age of Empires IV": "https://cdn.cloudflare.steamstatic.com/steam/apps/1466860/header.jpg",
  "StarCraft II": "https://placehold.co/460x215/1e293b/38bdf8?text=StarCraft+II",
  "Warcraft III": "https://placehold.co/460x215/1e293b/38bdf8?text=Warcraft+III",
  "Total War Warhammer III": "https://cdn.cloudflare.steamstatic.com/steam/apps/1142710/header.jpg",
  "Crusader Kings III": "https://cdn.cloudflare.steamstatic.com/steam/apps/1158310/header.jpg",
  "Europa Universalis IV": "https://cdn.cloudflare.steamstatic.com/steam/apps/236850/header.jpg",
  "Hearts of Iron IV": "https://cdn.cloudflare.steamstatic.com/steam/apps/394360/header.jpg",
  "Football Manager 2024": "https://cdn.cloudflare.steamstatic.com/steam/apps/2252570/header.jpg",

  // --- Fighting & Hunting ---
  "Tekken 8": "https://cdn.cloudflare.steamstatic.com/steam/apps/1778820/header.jpg",
  "Street Fighter 6": "https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/header.jpg",
  "Mortal Kombat 1": "https://cdn.cloudflare.steamstatic.com/steam/apps/1971870/header.jpg",
  "Dragon Ball Sparking Zero": "https://cdn.cloudflare.steamstatic.com/steam/apps/1790600/header.jpg",
  "Naruto Ultimate Ninja Storm 4": "https://cdn.cloudflare.steamstatic.com/steam/apps/349040/header.jpg",
  "Monster Hunter World": "https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg",
  "Monster Hunter Wilds": "https://cdn.cloudflare.steamstatic.com/steam/apps/2636350/header.jpg",

  // --- MMORPG & Roguelike ---
  "Black Desert Online": "https://cdn.cloudflare.steamstatic.com/steam/apps/582660/header.jpg",
  "World of Warcraft": "https://placehold.co/460x215/1e293b/38bdf8?text=World+of+Warcraft",
  "Final Fantasy XIV": "https://cdn.cloudflare.steamstatic.com/steam/apps/39210/header.jpg",
  "Lost Ark": "https://cdn.cloudflare.steamstatic.com/steam/apps/1599340/header.jpg",
  "Guild Wars 2": "https://cdn.cloudflare.steamstatic.com/steam/apps/1284210/header.jpg",
  "Path of Exile": "https://cdn.cloudflare.steamstatic.com/steam/apps/238960/header.jpg",
  "Diablo IV": "https://cdn.cloudflare.steamstatic.com/steam/apps/2344520/header.jpg",
  "Hades": "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
  "Dead Cells": "https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg",

  // --- Metroidvania, Platformer & Horror ---
  "Hollow Knight": "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg",
  "Ori and the Will of the Wisps": "https://cdn.cloudflare.steamstatic.com/steam/apps/1057090/header.jpg",
  "Celeste": "https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg",
  "Cuphead": "https://cdn.cloudflare.steamstatic.com/steam/apps/268910/header.jpg",
  "Resident Evil 4 Remake": "https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg",
  "Resident Evil Village": "https://cdn.cloudflare.steamstatic.com/steam/apps/1196590/header.jpg",
  "Silent Hill 2 Remake": "https://cdn.cloudflare.steamstatic.com/steam/apps/2124490/header.jpg",
  "Outlast": "https://cdn.cloudflare.steamstatic.com/steam/apps/238320/header.jpg",
  "Amnesia The Bunker": "https://cdn.cloudflare.steamstatic.com/steam/apps/1944240/header.jpg",
  "Phasmophobia": "https://cdn.cloudflare.steamstatic.com/steam/apps/739630/header.jpg",
  "Lethal Company": "https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/header.jpg",
  "Among Us": "https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg",
  "Fall Guys": "https://placehold.co/460x215/1e293b/38bdf8?text=Fall+Guys",
  "Human Fall Flat": "https://cdn.cloudflare.steamstatic.com/steam/apps/477160/header.jpg"
};

function getGameImage(title){

    return (
        gameImages[title] ||
        `https://placehold.co/460x215?text=${encodeURIComponent(title)}`
    );

}

fetch("games.json")
.then(response => response.json())
.then(data => {
    games = data;
    console.log("Dataset Loaded:", games.length);
    
    // 💡 Hitung IDF setelah semua data game masuk
    calculateIDF();
});

// Fungsi baru untuk menghitung IDF
function calculateIDF() {
    const totalDocuments = games.length;
    const documentFrequency = {};

    // 1. Hitung berapa banyak dokumen yang mengandung setiap kata
    games.forEach(game => {
        const documentText = game.title + " " + game.genre + " " + game.description;
        const tokens = tokenize(documentText);
        const uniqueTokens = new Set(tokens); // Gunakan Set agar kata yang kembar di satu game hanya dihitung sekali

        uniqueTokens.forEach(word => {
            documentFrequency[word] = (documentFrequency[word] || 0) + 1;
        });
    });

    // 2. Hitung rumus IDF untuk setiap kata: log(Total Dokumen / Dokumen yang mengandung kata) + 1
    for (let word in documentFrequency) {
        idfWeights[word] = Math.log(totalDocuments / documentFrequency[word]) + 1;
    }
}

function fillKeyword(keyword) {
    // 1. Masukkan teks kategori ke dalam input box
    document.getElementById("searchInput").value = keyword;
    
    // 2. Langsung panggil fungsi pencarian otomatis
    searchGame();
}

function tokenize(text){
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "") // Hapus tanda baca
        .split(/\s+/)            // Pecah jadi array kata
        .filter(word => word.length > 0 && !stopwords.has(word)); // 💡 Saring: buang kata jika ada di daftar stopwords
}

function createVector(words, isQuery = false) {
    const vector = {};
    
    // Hitung Term Frequency (TF) awal
    words.forEach(word => {
        vector[word] = (vector[word] || 0) + 1;
    });

    // 💡 Ubah nilai TF menjadi nilai TF-IDF
    for (let word in vector) {
        const idf = idfWeights[word] || (isQuery ? 1 : 0);
        vector[word] = vector[word] * idf;
    }

    return vector;
}

function cosineSimilarity(a, b){

    let dotProduct = 0;

    let magnitudeA = 0;

    let magnitudeB = 0;

    for(let key in a){

        dotProduct +=
            (a[key] || 0) *
            (b[key] || 0);

    }

    for(let key in a){

        magnitudeA +=
            a[key] * a[key];

    }

    for(let key in b){

        magnitudeB +=
            b[key] * b[key];

    }

    magnitudeA =
        Math.sqrt(magnitudeA);

    magnitudeB =
        Math.sqrt(magnitudeB);

    if(
        magnitudeA === 0 ||
        magnitudeB === 0
    ){
        return 0;
    }

    return dotProduct /
    (
        magnitudeA *
        magnitudeB
    );

}

function searchGame(){
    const query = document.getElementById("searchInput").value;
    const queryTokens = tokenize(query);
    
    // Beri tanda true karena ini adalah vektor kueri
    const queryVector = createVector(queryTokens, true); 

    const results = games.map(game => {
        const documentText = game.title + " " + game.genre + " " + game.description;
        const documentTokens = tokenize(documentText);
        
        // Vektor dokumen otomatis menggunakan idfWeights dari dataset
        const documentVector = createVector(documentTokens, false);

        const score = cosineSimilarity(queryVector, documentVector);

        return {
            ...game,
            score: Number(score.toFixed(4))
        };
    })
    .filter(game => game.score > 0)
    .sort((a, b) => b.score - a.score);

    showResults(results);
}

function showResults(results){

    const container =

    document.getElementById(
        "results"
    );

    container.innerHTML = "";

    if(results.length === 0){

        container.innerHTML =

        `
        <h2>
            Tidak ada hasil ditemukan
        </h2>
        `;

        return;
    }

    container.innerHTML =

    `
    <h3>
        Ditemukan
        ${results.length}
        game
    </h3>
    `;

    results.forEach(game => {

        container.innerHTML +=

        `
        <div class="card">

            <img
                src="${getGameImage(game.title)}"
                class="game-image"
                alt="${game.title}"
            >

            <h2>
                ${game.title}
            </h2>

            <p>
                ${game.genre}
            </p>

            <p>
                ${game.description}
            </p>

            <div class="score">

                Similarity Score :
                ${game.score}

            </div>

        </div>
        `;

    });

}

document
.getElementById(
    "searchInput"
)
.addEventListener(
    "keypress",
    function(event){

        if(
            event.key === "Enter"
        ){

            searchGame();

        }

    }
);
