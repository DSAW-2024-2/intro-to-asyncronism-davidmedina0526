const container = document.querySelector(".pokemon-container");
const loader = document.querySelector(".loader");
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");

const searchPokemon = event => {
    event.preventDefault();
    const { value } = event.target;
    fetch(`https://pokeapi.co/api/v2/pokemon/${value.toLowerCase()}`)
        .then(data => data.json())
        .then(response => {
            removeChildNodes(container);
            createPokemon(response);
        });
}

function fetchPokemonByName() {
    const pokemonName = document.querySelector('input[name="pokemon"]').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    if (pokemonName === "") {
        removeChildNodes(container);
        offset = 1;
        fetchPokemons(offset, limit);
        return;
    }

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('The Pokémon was not found');
            }
        })
        .then(data => {
            removeChildNodes(container);
            createPokemon(data);
        })
        .catch(error => {
            alert(error.message);
        });
}

document.querySelector('.searchInput').addEventListener('submit', function(event) {
    event.preventDefault();
    fetchPokemonByName();
});

let offset = 1;
let limit = 9;

previous.addEventListener('click', () => {
    if (offset != 1) {
        offset -= 9;
        removeChildNodes(container);
        fetchPokemons(offset, limit);
    }
});

next.addEventListener('click', () => {
    offset += 9;
    removeChildNodes(container);
    fetchPokemons(offset, limit);
})

function fetchPokemon(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then((res) => res.json())
        .then((data) => {
            createPokemon(data);
            loader.style.display = "none";
        });
}

function fetchPokemons(offset, limit) {
    loader.style.display = "block";
    for(let i = offset; i <= offset + limit; i++) {
        fetchPokemon(i);
    }
}

function createPokemon(pokemon) {
    const flipCard = document.createElement('div');
    flipCard.classList.add('flip-card');

    const frontFace = document.createElement('div');
    frontFace.classList.add('front-face');

    const backFace = document.createElement('div');
    backFace.classList.add('back-face');
    
    backFace.appendChild(progressBars(pokemon.stats));

    flipCard.appendChild(frontFace);
    flipCard.appendChild(backFace);

    const card = document.createElement('div');
    card.classList.add('pokemon-block');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const sprite = document.createElement('img');
    sprite.src = pokemon.sprites.front_default;

    imageContainer.appendChild(sprite);

    const number = document.createElement('p');
    number.classList.add('number');
    number.textContent = `Id: #${pokemon.id.toString().padStart(3, 0)}`;

    const name = document.createElement('p');
    name.classList.add('name');
    name.textContent = pokemon.name;

    const weight = document.createElement('p');
    weight.classList.add('weight');
    weight.textContent = `Weight: ${pokemon.weight} kg`;

    const type = document.createElement('p');
    type.classList.add('type');
    const pokemonType = pokemon.types[0].type.name;
    type.textContent = `Type: ${pokemonType}`;

    const typeColors = {
        grass: '#78C850',
        fire: '#F08030',
        water: '#6890F0',
        bug: '#A8B820',
        normal: '#A8A878',
        poison: '#A040A0',
        electric: '#F8D030',
        ground: '#E0C068',
        fairy: '#EE99AC',
        fighting: '#C03028',
        psychic: '#F85888',
        rock: '#B8A038',
        ghost: '#705898',
        ice: '#98D8D8',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        flying: '#A890F0'
    };

    card.appendChild(imageContainer);
    card.appendChild(number);
    card.appendChild(name);
    card.appendChild(weight);
    card.appendChild(type);

    card.style.backgroundColor = typeColors[pokemonType] || '#fff';
    backFace.style.backgroundColor = typeColors[pokemonType] || '#fff';

    frontFace.appendChild(card);

    container.appendChild(flipCard);
}

function progressBars(stats) {
    const statsContainer = document.createElement('div');
    statsContainer.classList.add('stats-container');

    for (let i = 0; i < stats.length; i++) {
        const stat = stats[i];

        const statPercent = stat.base_stat / 2 + "%";
        const statContainer = document.createElement('div');
        statContainer.classList.add("stat-container");

        const statName = document.createElement('div');
        statName.textContent = stat.stat.name;

        const progress = document.createElement('div');
        progress.classList.add('progress');

        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.setAttribute("aria-valuenow", stat.base_stat);
        progressBar.setAttribute("aria-valuemin", 0);
        progressBar.setAttribute("aria-valuemax", 1000);
        progressBar.style.width = statPercent;

        progressBar.textContent = stat.base_stat;

        progress.appendChild(progressBar);
        statContainer.appendChild(statName);
        statContainer.appendChild(progress);
        statsContainer.appendChild(statContainer);
    }

    return statsContainer;
}

function removeChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

fetchPokemons(offset, limit);