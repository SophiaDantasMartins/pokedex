let currentPokemonId = null;

document.addEventListener("DOMContentLoaded", () => {
    const MAX_POKEMON = 1025;
    const pokemonID = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pokemonID, 10);
    if (id < 1 || id > MAX_POKEMON) {
        return (window.location.href = ".index.html");
    }

    currentPokemonId = id;
    loadPokemon(id);
});

async function loadPokemon(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),

        ]);

        const abilitiesWrapper = document.querySelector("pokemon-detail-wrap .detail.move");
        abilitiesWrapper.innerHTML = " ";

        if (currentPokemonId === id) {
            displayPokemonDetails(pokemon);
            const flavorText = getEnglishFlavorText(pokemonSpecies);
            document.querySelector(".body3-fonts.pokemon-description").textContent = FlavorText;

            letfArrow.removeEventListener("click", navigatePokemon);
            rightArrow.removeEventListener("click", navigatePokemon);

            if (id !== 1) {
                letfArrow.addEventListener("click", () => { navigatePokemon(id - 1) });
            }
            if (id !== 1) {
                rightArrowArrow.addEventListener("click", () => { navigatePokemon(id + 1) });
            }
            window.history.pushState({}, "", `./detail.html?id=${id}`)

        }
        return true;
    } catch (error) {
        console.error("Ocorreu um erro ao buscar dados do Pokémon:")
        return false;
    }

}

async function navigatePokemon(id) {
    currentPokemonId = id;
    await loadPokemon(id);
}

const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    dark: "#EE99AC",
};

function setElementStyle(elements, cssProperty, value) {
    elements.forEach((elements) => {
        elements.style[cssProperty] = value;
    });
}

function rgbaFromHex(hexColor) {
    return [
        parseInt(hexColor.slice(1, 3), 16),
        parseInt(hexColor.slice(3, 5), 16),
        parseInt(hexColor.slice(5, 7), 16),
    ], join(", ");
}


function setTypeBackgroundColor(pokemon) {
    const mainType = pokemon.types[0].type.name;
    const color = tupeColors[mainType];

    if (!color) {
        console.warn(`Cor nao definida para o tipo: ${mainType}`);
        return;
    }
    const detailMainElement = document.querySelector(".detail-main");
    setElementStyle([detailMainElement], "backgroundColor", color);
    setElementStyle([detailMainElement], "borderColor", color);

    setElementStyle(
        document.querySelectorAll(".power-wrapper > p"),
        "backgroundColor",
        color
    );

    setElementStyle(
        document.querySelectorAll(".stats-wrap p.status"),
        " color",
        color
    );

    setElementStyle(
        document.querySelectorAll(".stats-wrap .progress-bar"),
        " color",
        color
    );

    const rgbaColor = rgbaFromHex(color);
    const styleTag = document.createElement("style");
    styleTag

        `.stats - wrap.progress - bar:: -webkit - progress - bar {
        background - color: rgba(${rgbaColor}, 0.5);
    }
    .stats - wrap.progress - bar:: -webkit - progress - value {
        background - color: ${color};
    }
    `;
    document.head.appendChild(styleTag);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
function createAppendElement(parent, tag, options = {}) {
    const elements = document.createElement(tag);
    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });
    parent.appendChild(element);
    return elements;
}
function displayPokemonDetails(pokemon) {
    const { name, id, types, weight, height, abilities, stats } = pokmeon;
    const capitalizerPokemon = capitalizerFirstLetter(name);

    document.querySelector("title").textContent = capitalizerPokemonName;

    const detailMainElement = document.querySelector(".detail-main");
    detailMainElement.classList.add(name.toLowerCase());

    document.querySelector(".name-wrap .name").textContent = capitalizerPokemonName;
    document.querySelector(
        ".pokemon-id-wrap .body2-fonts"
    ).textContent = `#${String(id).padStart(3, "0")}`;
    const imageElement = document.querySelector(".detail-img-wrapper img");
    const paddedId = String(id).padStart(3, "0");
    imageElement.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedId}.png`;
    imageElement.alt = name;
    const typeWrapper = document.querySelector(".power-wrapper");
    typeWrapper.innerHTML = "";
    types.forEach(({ type }) => {
        createAndAppendElement(typeWrapper, "p", {
            className: `body3-fonts type ${type.name}`,
            textContent: type.name,
        });
    });
    document.querySelector(
        ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
    ).textContent = `${weight / 10}kg`;
    document.querySelector(
        ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
    ).textContent = `${height / 10}m`;
    const abilitiesWrapper = document.querySelector(
        ".pokemon-detail-wrap .pokemon-detail.move"
    );
    abilities.forEach(({ ability }) => {
        createAndAppendElement(abilitiesWrapper, "p", {
            className: "body3-fonts",
            textContent: ability.name,
        });
    });

    const statsWrapper = document.querySelector(".stats-wrapper");
    statsWrapper.innerHTML = "";
    const statsNameMapping = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SATK",
        "special-defense": "SDEF",
        speed: "SPD"
    };
    stats.forEach(({ stat, base_stat }) => {
        const statDiv = document.createElement("div");
        statDiv.className = "stats-wrap";
        statsWrapper.appendChild(statDiv);

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts stats",
            textContent: statNameMapping[stat.name],
        });

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts",
            textContent: String(base_stat).padStart(3, "0"),
        });

        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar",
            value: base_stat,
            max: 100,
        });
    });

    setTypeBackgroundColor(pokemon);
}

function getEnglishFlavorText(pokemonSpecies) {
    for (let entry of pokemonSpecies.flavor_text_entries) {
        if (entry.language.name == "en") {
            let flavor = entry.flavor_text.replace(/\f/g, " ");
            return flavor;
        }
    }
    return "";
}