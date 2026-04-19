const pageSize = 40;
let currentOffset = 0, totalCount = 0, currentType = 'all';
let listElement, prevBtn, nextBtn, pageInfo, typeFilter;

window.addEventListener('DOMContentLoaded', () => {
    listElement = document.getElementById('listPokemon');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    pageInfo = document.getElementById('pageInfo');
    typeFilter = document.getElementById('typeFilter');

    prevBtn.addEventListener('click', () => currentOffset >= pageSize && loadPokemonPage(currentOffset - pageSize));
    nextBtn.addEventListener('click', () => currentOffset + pageSize < totalCount && loadPokemonPage(currentOffset + pageSize));
    typeFilter.addEventListener('change', () => { currentType = typeFilter.value; loadPokemonPage(0); });

    loadTypeFilter();
    loadPokemonPage(0);
});

async function loadTypeFilter() {
    try {
        const data = await (await fetch('https://pokeapi.co/api/v2/type')).json();
        const types = data.results.filter(t => !['unknown', 'shadow'].includes(t.name));
        typeFilter.innerHTML = '<option value="all">Todos</option>' + types.sort((a, b) => a.name.localeCompare(b.name)).map(t => `<option value="${t.name}">${cap(t.name)}</option>`).join('');
    } catch (error) {}
}

async function loadPokemonPage(offset = 0) {
    listElement.innerHTML = '<li>Cargando...</li>';
    try {
        let pagePokemons = [];
        if (currentType === 'all') {
            const data = await (await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`)).json();
            totalCount = data.count;
            currentOffset = offset;
            //promise es como la peticion, con await se espera a que se cumplan todas antes de continuar
            pagePokemons = await Promise.all(data.results.map(p => fetchPokemonDetail(p.url)));
        } else {
            const data = await (await fetch(`https://pokeapi.co/api/v2/type/${currentType}`)).json();
            const allPokemons = data.pokemon.map(i => i.pokemon);
            totalCount = allPokemons.length;
            currentOffset = offset;
            pagePokemons = await Promise.all(allPokemons.slice(offset, offset + pageSize).map(p => fetchPokemonDetail(p.url)));
        }
        renderPokemonList(pagePokemons);
        updatePagination(currentOffset, totalCount, pagePokemons.length);
    } catch (error) {
        listElement.innerHTML = '<li>Error al cargar.</li>';
    }
}

async function fetchPokemonDetail(url) {
    try {
        const data = await (await fetch(url)).json();
        return { name: data.name, sprite: data.sprites?.front_default || '', types: data.types.map(t => t.type.name) };
    } catch (error) {
        return { name: 'Error', sprite: '', types: [] };
    }
}

function renderPokemonList(pokemonArray) {
    if (!pokemonArray.length) {
        listElement.innerHTML = '<li>Sin resultados.</li>';
        return;
    }
    listElement.innerHTML = pokemonArray.map((p, i) => {
        const pos = currentOffset + i + 1;
        const typesHtml = p.types.map(t => `<span class="type-badge">${cap(t)}</span>`).join('');
        const imgHtml = p.sprite ? `<img src="${p.sprite}" alt="${p.name}" class="pokemon-thumb">` : `<div class="pokemon-thumb placeholder">?</div>`;
        return `<li class="pokemon-card" onclick="window.location.href='busqueda.html?pokemon=${encodeURIComponent(p.name)}'">${imgHtml}
        <div class="pokemon-info"><strong>${pos}. ${cap(p.name)}</strong>
        <div class="type-list">${typesHtml}</div></div></li>`;}).join('');
}

function updatePagination(offset, total, pageCount) {
    prevBtn.disabled = offset === 0;
    nextBtn.disabled = offset + pageSize >= total;
    const page = Math.floor(offset / pageSize) + 1;
    const totalPages = Math.ceil(total / pageSize);
    pageInfo.textContent = `${offset + 1}-${offset + pageCount} de ${total} (${page}/${totalPages})`;
}

function cap(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}