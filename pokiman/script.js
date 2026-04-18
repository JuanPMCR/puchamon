let currentPokemon = null;
/*await funciona para las funciones async para que primero se haga el fetch y luego se continue el codigo, haciendo que primero se busque
el pokemon y luego ya te lo de todo bonito*/
async function fetchingPokemon(pokemon) {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon);
        if (!response.ok) {
            throw new Error("Error");
        }
        const data = await response.json();
        console.log(data);
        await changePokemon(data);
    } catch (error) {
        console.error("Error fetching", error);
    }
}

function searchPokemon() {
    let busq = document.getElementById("buscarPokemon").value.toLowerCase();
    fetchingPokemon(busq);
}

function Shiny() {
    if (!currentPokemon) return;
    let img = document.getElementById("imgPokemon");
    img.src = currentPokemon.sprites.front_shiny;
}

function normal() {
    if (!currentPokemon) return;
    let img = document.getElementById("imgPokemon");
    img.src = currentPokemon.sprites.front_default;
}

async function changePokemon(pokemon) {
    currentPokemon = pokemon;
    let name = document.getElementById("nomPokemon");
    let type = document.getElementById("typePokemon");
    let wei = document.getElementById("weightPokemon");
    let height = document.getElementById("heightPokemon");
    let id = document.getElementById("idPokemon");
    let img = document.getElementById("imgPokemon");
    let ability = document.getElementById("abilitiesPokemon");
    let moves = document.getElementById("movesPokemon");
    let stats = document.getElementById("statsPokemon");
    let evolutions = document.getElementById("evolutionsPokemon");

    name.innerHTML = pokemon.name;
    type.innerHTML = pokemon.types.map(t => t.type.name).join("<br>");
    height.innerHTML = pokemon.height + " ft";
    wei.innerHTML = pokemon.weight + " lbs";
    id.innerHTML = pokemon.id;
    ability.innerHTML = pokemon.abilities.map(abil => abil.ability.name).join(" | ");
    moves.innerHTML = pokemon.moves.map(mov => mov.move.name).join(" | ");
    img.src = pokemon.sprites.front_default;
    stats.innerHTML = pokemon.stats.map(stat => stat.stat.name + ": " + stat.base_stat).join("<br>");

    //evoluciones
    await fetchEvolutions(pokemon.species.url);
}

async function fetchEvolutions(speciesUrl) {
    try {
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        const evolutionUrl = speciesData.evolution_chain.url;

        const evolutionResponse = await fetch(evolutionUrl);
        const evolutionData = await evolutionResponse.json();

        const evolutionNames = EvolutionChain(evolutionData.chain);

        const evolutionDetails = [];
        
        for (const name of evolutionNames) {
            const pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const pokeData = await pokeResponse.json();
            evolutionDetails.push({ name: pokeData.name, image: pokeData.sprites.front_default });
        }

        displayEvolutions(evolutionDetails);
    } catch (error) {
        console.error("Error fetching evolutions", error);
        document.getElementById("evolutionsPokemon").innerHTML = "Error al cargar evoluciones";
    }
}

function EvolutionChain(chain) {
    const evos = [chain.species.name];
    for (const next of chain.evolves_to) {
        evos.push(EvolutionChain(next));
    }
    return evos;
}

function displayEvolutions(details) {
    const evoElement = document.getElementById("evolutionsPokemon");
    evoElement.innerHTML = details.map(d => `<img src="${d.image}" alt="${d.name}" style="width:50px; height:50px;"> ${d.name}`).join('<br>');
}

//movimientos

async function fetchingPokemonMov(moves) {
    fetch("https://pokeapi.co/api/v2/move/" + moves).then(response => {
        if (!response.ok) {
        throw new Error("Error");
    }
    return response.json();
    }).then(data => {
        console.log(data);
        changeMoves(data);
    }).catch(error => {
        console.error("Error fetching", error);
    });
}

function searchMoves() {
    if (!currentPokemon) {
        document.getElementById("movesDetails").innerHTML = "No se encontro";
        return;
    }

    let busq = document.getElementById("buscarMovimiento").value.toLowerCase();
    if (!busq) {
        document.getElementById("movesDetails").innerHTML = "Ingresa un movimiento para buscar.";
        return;
    }

    const puedeAprender = currentPokemon.moves.some(mov => mov.move.name.toLowerCase() == busq);

    if (puedeAprender) {
        fetchingPokemonMov(busq);
    } else {
        document.getElementById("movesDetails").innerHTML = "Este pokemon no aprende ese movimiento.";
    }
}

function changeMoves(moves) {
    let moveDetails = document.getElementById("movesDetails");
    moveDetails.innerHTML = "Nombre: " + moves.name + "<br>" +
                            "Tipo: " + moves.type.name + "<br>" +
                            "Poder: " + moves.power + "<br>" +
                            "PP: " + moves.pp + "<br>" +
                            "Precision: " + moves.accuracy;
}

//items
async function fetchingPokemonItem(items) {
    fetch("https://pokeapi.co/api/v2/item/{id or name}/" + items).then(response => {
        if (!response.ok) {
        throw new Error("Error");
    }
    return response.json();
    }).then(data => {
        console.log(data);
        changeItems(data);
    }).catch(error => {
        console.error("Error fetching", error);
    });

}

function searchItems() {
    if (!currentPokemon) {
            document.getElementById("itemsDetails").innerHTML = "No se encontro";
            return;
        }

        let busq = document.getElementById("buscarItem").value.toLowerCase();
        if (!busq) {
            document.getElementById("itemsDetails").innerHTML = "Ingresa un item para buscar.";
            return;
        }

function changeItems(items) {
let itemDetails = document.getElementById("itemsDetails");
itemDetails.innerHTML = "Nombre: " + items.name + "<br>" +
                        "Descripción: " + items.effect_entries[0].effect + "<br>" +
                        "Precio: " + items.price;
}};
