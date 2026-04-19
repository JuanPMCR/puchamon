let currentMove = null;

async function fetchingPokemonMov(moves) {
    try {
        const data = await (await fetch(`https://pokeapi.co/api/v2/move/${moves}`)).json();
        await changeMov(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Movimiento no encontrado.');
    }
}

function searchMoves() {
    const busq = document.getElementById('buscarMovimiento').value.trim().toLowerCase();
    if (busq) fetchingPokemonMov(busq);
}

async function changeMov(move) {
    currentMove = move;
    document.getElementById('nomMove').textContent = move.name;
    document.getElementById('typeMove').textContent = move.type.name;
    document.getElementById('powerMove').textContent = move.power || 'N/A';
    document.getElementById('ppMove').textContent = move.pp;
    document.getElementById('accuracyMove').textContent = move.accuracy || 'N/A';
    document.getElementById('priorityMove').textContent = move.priority;
}