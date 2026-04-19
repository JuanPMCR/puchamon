let currentPokemon = null;

window.addEventListener('DOMContentLoaded', () => {
    const pokemonQuery = new URLSearchParams(window.location.search).get('pokemon');
    if (pokemonQuery) {
        document.getElementById('buscarPokemon').value = pokemonQuery.toLowerCase();
        fetchingPokemon(pokemonQuery.toLowerCase());
    }
});

//busqueda
async function fetchingPokemon(pokemon) {
    try {
        const data = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)).json();
        await changePokemon(data);
    } catch (error) {
        alert('Pokémon no encontrado. Intenta con nombre o número.');
    }
}

function searchPokemon() {
    const busq = document.getElementById('buscarPokemon').value.trim();
    if (busq) fetchingPokemon(busq.toLowerCase());
}

async function changePokemon(pokemon) {
    currentPokemon = pokemon;
    const elements = {
        nomPokemon: pokemon.name,
        typePokemon: pokemon.types.map(t => t.type.name).join('<br>'),
        weightPokemon: `${pokemon.weight} lbs`,
        heightPokemon: `${pokemon.height} ft`,
        idPokemon: pokemon.id,
        abilitiesPokemon: pokemon.abilities.map(a => `<li>${a.ability.name}</li>`).join(''),
        movesPokemon: pokemon.moves.map(m => `<li class="move-item" onclick="showMoveDetails(this, '${m.move.name}')"><span class="move-name">${m.move.name}</span>
            <div class="move-info"></div></li>`).join(''),
        statsPokemon: pokemon.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join('<br>')
    };
    Object.entries(elements).forEach(([id, val]) => document.getElementById(id).innerHTML = val);
    document.getElementById('imgPokemon').src = pokemon.sprites.front_default;
    await fetchEvolutions(pokemon.species.url);
}

//shiny y normal
function toggleShiny() {
    if (currentPokemon) document.getElementById('imgPokemon').src = currentPokemon.sprites.front_shiny;
}

function toggleNormal() {
    if (currentPokemon) document.getElementById('imgPokemon').src = currentPokemon.sprites.front_default;
}

//movimientos
async function fetchingPokemonMov(moves) {
    try {
        return await (await fetch(`https://pokeapi.co/api/v2/move/${moves}`)).json();
    } catch (error) {
        return null;
    }
}

async function showMoveDetails(item, moveName) {
    const detailDiv = item.querySelector('.move-info');
    if (item.classList.contains('active')) {
        item.classList.remove('active');
        detailDiv.innerHTML = '';
        return;
    }
    const moveData = await fetchingPokemonMov(moveName);
    if (!moveData) {
        detailDiv.innerHTML = 'Error';
        return;
    }
    detailDiv.innerHTML = `
    <strong>Tipo:</strong> ${moveData.type.name}<br>
    <strong>Poder:</strong> ${moveData.power ?? '-'}<br>
    <strong>PP:</strong> ${moveData.pp ?? '-'}<br>
    <strong>Precision:</strong> ${moveData.accuracy ?? '-'}<br>
    <strong>Prioridad:</strong> ${moveData.priority}`;
    item.classList.add('active');
}

//evos
async function fetchEvolutions(speciesUrl) {
    try {
        const speciesData = await (await fetch(speciesUrl)).json();
        const evolutionData = await (await fetch(speciesData.evolution_chain.url)).json();
        const evolutionNames = getEvolutionChain(evolutionData.chain);
        const evolutionDetails = await Promise.all(evolutionNames.map(async name => {
            const pokeData = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)).json();
            return { name: pokeData.name, image: pokeData.sprites.front_default };
        }));
        displayEvolutions(evolutionDetails);
    } catch (error) {
        document.getElementById('evolutionsPokemon').innerHTML = 'Error';
    }
}

function getEvolutionChain(chain) {
    const evos = [chain.species.name];
    chain.evolves_to.forEach(next => evos.push(...getEvolutionChain(next)));
    return evos;
}

function displayEvolutions(details) {
    document.getElementById('evolutionsPokemon').innerHTML = `<div class="evolutions-container">${details.map(d => `<div class="evolution-item" onclick="fetchingPokemon('${d.name}')"><img src="${d.image}" alt="${d.name}" style="width:50px; height:50px;"> ${d.name}</div>`).join('')}</div>`;
}

//items
async function fetchingPokemonItem(items) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/item/${items}`);
        if (!response.ok) throw new Error('Item no encontrado');
        const data = await response.json();
        changeItems(data);
    } catch (error) {
        console.error('Error fetching item:', error);
    }
}

function searchItems() {
    if (!currentPokemon) {
        document.getElementById('itemsDetails').innerHTML = 'No se encontró';
        return;
    }
    const busq = document.getElementById('buscarItem').value.toLowerCase().trim();
    if (!busq) {
        document.getElementById('itemsDetails').innerHTML = 'Ingresa un item para buscar.';
        return;
    }
    fetchingPokemonItem(busq);
}

function changeItems(items) {
    document.getElementById('itemsDetails').innerHTML = `Nombre: ${items.name}<br>
    Descripción: ${items.effect_entries[0]?.effect || 'N/A'}<br>Precio: ${items.cost || 'N/A'}`;
}
