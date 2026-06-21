let games = [];

const gameImages = {

  "Valorant":"https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",

  "Counter Strike 2":"https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",

  "Apex Legends":"https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg",

  "PUBG Battlegrounds":"https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg",

  "Rust":"https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg",

  "Terraria":"https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg",

  "Palworld":"https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg",

  "Cyberpunk 2077":"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",

  "The Witcher 3":"https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",

  "Elden Ring":"https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",

  "Red Dead Redemption 2":"https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",

  "Grand Theft Auto V":"https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",

  "Forza Horizon 5":"https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg",

  "Dota 2":"https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg",

  "Minecraft":"https://placehold.co/460x215?text=Minecraft",

  "League of Legends":"https://placehold.co/460x215?text=League+of+Legends",

  "Genshin Impact":"https://placehold.co/460x215?text=Genshin+Impact"

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

    console.log(
        "Dataset Loaded:",
        games.length
    );

});

function fillKeyword(keyword){

    document
    .getElementById("searchInput")
    .value = keyword;

}

function tokenize(text){

    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 0);

}

function createVector(words){

    const vector = {};

    words.forEach(word => {

        vector[word] =
            (vector[word] || 0) + 1;

    });

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

    const query =

    document
    .getElementById(
        "searchInput"
    )
    .value;

    const queryTokens =
        tokenize(query);

    const queryVector =
        createVector(queryTokens);

    const results =

    games
    .map(game => {

        const documentText =

            game.title +
            " " +
            game.genre +
            " " +
            game.description;

        const documentTokens =
            tokenize(documentText);

        const documentVector =
            createVector(documentTokens);

        const score =

            cosineSimilarity(
                queryVector,
                documentVector
            );

        return {

            ...game,

            score:
            Number(
                score.toFixed(4)
            )

        };

    })
    .filter(
        game =>
        game.score > 0
    )
    .sort(
        (a,b) =>
        b.score - a.score
    );

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