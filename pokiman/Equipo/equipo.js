const TEAM_STORAGE_KEY = 'puchamon_team';

window.addEventListener('DOMContentLoaded', displayTeam);

function getTeam() {
    try {
        return JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveTeam(team) {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
}

function displayTeam() {
    const team = getTeam();
    const container = document.getElementById('teamContainer');
    const clearButton = document.getElementById('btnClearTeam');

    if (!team.length) {
        container.innerHTML = '<p>No hay Pokémones en el equipo</p>';
        if (clearButton) clearButton.style.display = 'none';
        return;
    }

    container.innerHTML = team.map((pokemon, index) => `
        <div class="team-card">
            <img src="${pokemon.sprite}" alt="${pokemon.name}" width="96" height="96">
            <div class="team-card-info">
                <h2>${pokemon.name}</h2>
                <p><strong>ID:</strong> ${pokemon.id}</p>
                <p><strong>Tipos:</strong> ${pokemon.types.join(', ')}</p>
                <button type="button" onclick="removeFromTeam(${index})">Eliminar</button>
            </div>
        </div>
    `).join('');

    if (clearButton) clearButton.style.display = 'inline-block';
}

function removeFromTeam(index) {
    const team = getTeam();
    if (index < 0 || index >= team.length) return;
    team.splice(index, 1);
    saveTeam(team);
    displayTeam();
}

function clearTeam() {
    if (!confirm('¿Deseas eliminar todo el equipo?')) return;
    saveTeam([]);
    displayTeam();
}
