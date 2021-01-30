const pokedex = document.getElementById('pokedex');
const showSearch = document.getElementById('show-search');
const errorMsg = document.getElementById('error-msg');
const pokemonInput = document.getElementById("search-pokemon-field");
const submitForm = document.getElementById("submit-search");

const fetchPokemon = async () => {
    const promises = [];
    for (let i=1; i <= 150; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        try {
            promises.push(fetch(url).then(res => res.json()));
        } catch (e) {
            console.error(e)
        }
    }
    Promise.all(promises).then(results => {
        const pokemon = results.map(data => {
            const {id, name, sprites} = data;
            return ({
                id,
                name,
                img: sprites['front_default'],
                type: data.types.map(type => type.type.name).join(', '),
            })
        })
        displayPokemon(pokemon)
    })
};

const displayPokemon = (pokemons) => {
    const pokemonHTMLString = pokemons.map(pokemon => {
        const {id, name, img, type} = pokemon;
        return (`
            <li class="card">
                <img src="${img}" class="card__img"/>
                <h2 class="card__title">${id}. ${name}</h2>
                <p class="card__subtitle">Type: ${type}</p>
            </li>
        `)
    }).join("");
    pokedex.innerHTML = pokemonHTMLString;
}

const searchPokemon = async name => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    await fetch(url)
        .then(res => res.json())
        .then(data => {
            errorMsg.style.display = "none";
            const {id, name, sprites} = data;
            const pokemon = {
                id,
                name,
                img: sprites["front_default"],
                type: data.types.map(type => type.type.name).join(', '),
            }
            const showPokemonHTML = `
            <li class="card">
                <img src="${pokemon.img}" class="card__img"/>
                <h2 class="card__title">${pokemon.id}. ${pokemon.name}</h2>
                <p class="card__subtitle">Type: ${pokemon.type}</p>
            </li>
            `;
            showSearch.innerHTML = showPokemonHTML;
        })
        .catch(err => {
            errorMsg.style.display = "block";
            errorMsg.textContent = `Cannot find ${name}... please try again.`
        });
}

submitForm.addEventListener('click', e => {
    e.preventDefault();
    const search = pokemonInput.value.toLowerCase().trim();
    if (search.length == 0 ) {
        errorMsg.style.display = "block";
        errorMsg.textContent = `Enter a pokemon here... Cannot be blank`
        pokemonInput.value = "";
    } else {
        searchPokemon(search);
    }
})

document.addEventListener("DOMContentLoaded", e => { 
    fetchPokemon();
  });