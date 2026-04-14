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
    let busq = document.getElementById("buscarPokemon").value;
    fetchingPokemon(busq);
}

function changePokemon(pokemon) {
    let name = document.getElementById("nomPokemon");
    let type = document.getElementById("typePokemon");
    let wei = document.getElementById("weightPokemon");
    let height = document.getElementById("heightPokemon");
    let id = document.getElementById("idPokemon");
    let img = document.getElementById("imgPokemon");
    let ability = document.getElementById("abilitiesPokemon");
    let moves = document.getElementById("movesPokemon");

    name.innerHTML = pokemon.name;
    type.innerHTML = pokemon.types.map(t => t.type.name).join(" | ");
    height.innerHTML = pokemon.height + " mt";
    wei.innerHTML = pokemon.weight + " kg";
    id.innerHTML = pokemon.id;
    ability.innerHTML = pokemon.abilities.map(abil => abil.ability.name).join(" | ");
    moves.innerHTML = pokemon.moves.map(mov => mov.move.name).join(" | ");
    img.src = pokemon.sprites.front_default;
}