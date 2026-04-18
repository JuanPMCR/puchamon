let currentMove = null;

async function fetchingPokemonMov(moves) {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/move/" + moves);
        if (!response.ok) {
            throw new Error("Error");
        }
        const data = await response.json();
        console.log(data);
        await changeMov(data);
    } catch (error) {
        console.error("Error fetching", error);
    }
}

function searchMoves() {
    let busq = document.getElementById("buscarMovimiento").value.toLowerCase();
    fetchingPokemonMov(busq);
}

async function changeMov(move) {
    currentMove = move;
    let name = document.getElementById("nomMove");
    let type = document.getElementById("typeMove");
    let power = document.getElementById("powerMove");
    let pp = document.getElementById("ppMove");
    let accuracy = document.getElementById("accuracyMove");
    let priority = document.getElementById("priorityMove");

    name.textContent = move.name;
    type.textContent = move.type.name;
    power.textContent = move.power || "N/A";
    pp.textContent = move.pp;
    accuracy.textContent = move.accuracy || "N/A";
    priority.textContent = move.priority;
}