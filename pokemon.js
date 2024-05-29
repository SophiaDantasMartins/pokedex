const MAX_POKEMON = 1025;

const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessege = document.querySelector("#not-found-message");

let allPokemon = []; //cria lista vazia

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
    .then((response) => response.json())
    .then((data) => {
        allPokemon = data.results;
        displayPokemon(allPokemon);//funcao
    });

async function fetchPokemonDatabefoRect(id) {
    try {
        const [pokemon, pokemoSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}}`)
                .then((res) => res.json),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}}`)
                .then((res) => res.json),
        ]);
        return true;
    } catch (erro) {
        console.log("fedeu, falhou kkkkkkk");
    }
}

function displayPokemon(pokemon) {
    listWrapper.innerHTML = "";

    pokemon.forEach((pokemon) => {
        let pokemonID = pokemon.url.split("/")[6];
        pokemonIDzero = pokemonID.padStart(3, "0");
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="img-wrap">
            <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemonIDzero}.png" alt="${pokemon.name}" />
        </div>
        <div class="name-wrap">
            <p class="body3-fonts">#${pokemon.name}</p>
        </div>
    `;

        listItem.addEventListener("click", async () => {
            const success = await fetchPokemonDatabefoRect(pokemonID);
            if (success) {
                window.location.ref = `./detail.html?id=${pokemonID}`;
            }
        });
        listWrapper.appendChild(listItem)
    });
}

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
    const searchTerm = searchInput.value.toLoweCase();
    let filteredPokemon;
    if (numberFilter.checked) {
        filteredPokemon = allPokemon.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchTerm);
        });

    } else if (nameFilter.checked) {
        filteredPokemon = allPokemon.filter((pokemon) => {
            pokemon.name.toLoweCase().startsWith(searchTerm);
        });
    } else {
        filteredPokemon = allPokemon;
    }

    displayPokemon(filteredPokemon);

    if (filteredPokemon.leght === 0) {
        notFoundMessege.style.display = "block";
    } else {
        notFoundMessege.style.display = "none";
    }
}

const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
    searchInput.value = "";
    displayPokemon(allPokemon);
    notFoundMessege.style.display = "none";
}