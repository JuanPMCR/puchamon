let currentPokemon = null;

async function fetchingPokemon(pokemon) {
    fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon).then(response => {
        if (!response.ok) {
        throw new Error("Error");
    }
    return response.json();
    }).then(data => {
        console.log(data);
        changePokemon(data);
    }).catch(error => {
        console.error("Error fetching", error);
    });
}

function searchPokemon() {
    let busq = document.getElementById("buscarPokemon").value.toLowerCase();
    fetchingPokemon(busq);
}

function changePokemon(pokemon) {
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

    name.innerHTML = pokemon.name;
    type.innerHTML = pokemon.types.map(t => t.type.name).join("<br>");
    height.innerHTML = pokemon.height + " ft";
    wei.innerHTML = pokemon.weight + " lbs";
    id.innerHTML = pokemon.id;
    ability.innerHTML = pokemon.abilities.map(abil => abil.ability.name).join(" | ");
    moves.innerHTML = pokemon.moves.map(mov => mov.move.name).join(" | ");
    img.src = pokemon.sprites.front_default;
    stats.innerHTML = pokemon.stats.map(stat => stat.stat.name + ": " + stat.base_stat).join("<br>");
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
        document.getElementById("movesDetails").innerHTML = "nigga";
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
                            "prioridad: " + moves.priority + "<br>" +
                            "Precision: " + moves.accuracy;
}