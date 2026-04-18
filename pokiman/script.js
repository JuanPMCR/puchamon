let currentPokemon = null;
/*await funciona para las funciones async para que primero se haga el fetch y luego se continue el codigo, haciendo que primero se busque
el pokemon y luego ya te lo de todo bonito*/

//pokemon
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
    ability.innerHTML = pokemon.abilities.map(abil => `<li>${abil.ability.name}</li>`).join("");


    /*
    basicamente se recorre el array de los mov del puchamon y por cada uno se crea un li con el nombre del movimiento
    y un div donde con la funcion de abajo se le van a meter los detalles y finalmente el onclick es para que cuando lo clickes
    se active la funcion de showmovesdetes, luego detaildiv es el que va poner la info en el div del li. Con item se refiere al li
    y queryselector es para buscar el div dentro del li que tenga la clase move-info, entonces se hace el fetch
    del movimiento y esa info se mete en el detaildiv, que es le div del li y se agrega la clase active para que se vea la info
    al revisar que este con active si se vuelve a clikear se la quita y la informcaion se borra
    */
   
    moves.innerHTML = pokemon.moves.map(mov => 
        `<li class="move-item" onclick="showMoveDetails(this, '${mov.move.name}')">
            <span class="move-name">${mov.move.name}</span>
            <div class="move-info"></div>
        </li>` ).join('');

    img.src = pokemon.sprites.front_default;
    stats.innerHTML = pokemon.stats.map(stat => stat.stat.name + ": " + stat.base_stat).join("<br>");

    await fetchEvolutions(pokemon.species.url);
}

//shiny y 

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

function toggleShiny() {
    if (!currentPokemon) return;
    let img = document.getElementById("imgPokemon");
    img.src = currentPokemon.sprites.front_shiny;
}

function toggleNormal() {
    if (!currentPokemon) return;
    let img = document.getElementById("imgPokemon");
    img.src = currentPokemon.sprites.front_default;
}


//movimientos

async function fetchingPokemonMov(moves) {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/move/" + moves);
        if (!response.ok) {
            throw new Error("Error");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching", error);
        return null;
    }
}

async function showMoveDetails(item, moveName) {
    const detailDiv = item.querySelector(".move-info");
    if (item.classList.contains("active")) {
        item.classList.remove("active");
        detailDiv.innerHTML = "";
        return;
    }

    const moveData = await fetchingPokemonMov(moveName);
    if (!moveData) {
        detailDiv.innerHTML = "Error al cargar detalles";
        return;
    }

    detailDiv.innerHTML = 
       ` <strong>Tipo:</strong> ${moveData.type.name}<br>
        <strong>Poder:</strong> ${moveData.power ?? "-"}<br>
        <strong>PP:</strong> ${moveData.pp ?? "-"}<br>
        <strong>Precision:</strong> ${moveData.accuracy ?? "-"}<br>
        <strong>Prioridad:</strong> ${moveData.priority} `;
    item.classList.add("active");
}

/*

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
*/

//evoluciones
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
        evos.push(...EvolutionChain(next));
    }
    return evos;
}

function displayEvolutions(details) {
    const evoElement = document.getElementById("evolutionsPokemon");
    evoElement.innerHTML = `<div class="evolutions-container">${details.map(d => `<div class="evolution-item" onclick="fetchingPokemon('${d.name.toLowerCase()}')">
    <img src="${d.image}" alt="${d.name}" style="width:50px; height:50px;"> ${d.name}</div>`).join('')}</div>`;
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
