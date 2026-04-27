async function fetchingPokemonMov(moves) {
    try {
        const data = await (await fetch(`https://pokeapi.co/api/v2/move/${moves}`)).json();
        await changeMov(data);
    } catch (error) {
        alert('Movimiento no encontrado.');
    }
}

function searchMoves() {
    const busq = document.getElementById('buscarMovimiento').value.trim().toLowerCase();
    if (busq) fetchingPokemonMov(busq);
}

async function changeMov(move) {
    const els = {
        nomMove: move.name,
        typeMove: move.type.name,
        powerMove: move.power || 'N/A',
        ppMove: move.pp,
        accuracyMove: move.accuracy || 'N/A',
        priorityMove: move.priority
    };
    Object.entries(els).forEach(([id, val]) => document.getElementById(id).textContent = val);
}