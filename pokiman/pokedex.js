const pageSize = 40; //cantidad de pokemones que se mostrarán por página
//variables q rastrean la posicion actual, el total de resultados y el filtro activo
let currentOffset = 0, totalCount = 0, currentType = 'all'; 
//variables para almacenar las referencias a los elementos del HTML (DOM)
let listElement, prevBtn, nextBtn, pageInfo, typeFilter;

//este evento hace que el código se ejecute solo cuando el HTML haya cargado
window.addEventListener('DOMContentLoaded', () => {
    //asignamos los elementos del HTML a las variables
    listElement = document.getElementById('listPokemon');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    pageInfo = document.getElementById('pageInfo');
    typeFilter = document.getElementById('typeFilter');

    //los botones de paginación
    //si no estamos en la primera pagina, restamos al offset actual para retroceder
    prevBtn.addEventListener('click', () => currentOffset >= pageSize && loadPokemonPage(currentOffset - pageSize));
    //si no hemos llegado al final, sumamos al pageSize para avanzar
    nextBtn.addEventListener('click', () => currentOffset + pageSize < totalCount && loadPokemonPage(currentOffset + pageSize));
    
    //cuando se cambia el filtro, actualizamos el tipo actual y volvemos a la página 0
    typeFilter.addEventListener('change', () => { 
        currentType = typeFilter.value; 
        loadPokemonPage(0); 
    });

    //se carga la primera pagina y el filtro
    loadTypeFilter();
    loadPokemonPage(0);
});
//funcion para obtener los tipos de poke
async function loadTypeFilter() {
    try {
        const data = await (await fetch('https://pokeapi.co/api/v2/type')).json();
        //se filtran los tipos curiosos
        const types = data.results.filter(t => !['unknown', 'shadow', 'stellar'].includes(t.name));
        
        //el html de las opciones, primero el de todos y luego los tipos obtenidos.
        //se ordenan alfabeticamente y con mayuscula
        typeFilter.innerHTML = '<option value="all">Todos</option>' + 
            types.sort((a, b) => a.name.localeCompare(b.name))
                 .map(t => `<option value="${t.name}">${cap(t.name)}</option>`)
                 .join('');
    } catch (error) {
    }
}

//cargar los pokes
async function loadPokemonPage(offset = 0) {
    listElement.innerHTML = '<li>nigga...</li>';
    
    try {
        let pagePokemons = [];
        
        if (currentType === 'all') {
            //se muestran los pokemines
            const data = await (await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`)).json();
            totalCount = data.count; //total de los pokemones
            currentOffset = offset;
            
            // data.results solo trae el nombre y la url basica. 
            //usamos Promise.all para hacer peticiones al mismo tiempo a esas URLs y obtener sprites y tipos. para que vaya mas rapido
            pagePokemons = await Promise.all(data.results.map(p => fetchPokemonDetail(p.url)));
        } else {
            //muestra por tipos por el filtro
            const data = await (await fetch(`https://pokeapi.co/api/v2/type/${currentType}`)).json();
            const allPokemons = data.pokemon.map(i => i.pokemon);
            
            totalCount = allPokemons.length;
            currentOffset = offset;
            
            //se reciben todos los pokemones y se usa slice para que nos den solo los de la pagina actyal
            //despues de tomarlo se hagarran los detalles
            pagePokemons = await Promise.all(allPokemons.slice(offset, offset + pageSize).map(p => fetchPokemonDetail(p.url)));
        }
        
        //se renderiza la lista y se acvtualiza la pagina
        renderPokemonList(pagePokemons);
        updatePage(currentOffset, totalCount, pagePokemons.length);
    } catch (error) {
        listElement.innerHTML = '<li>Error al cargar.</li>';
    }
}

//se obtienen los nombres y sprites de los pokemones
async function fetchPokemonDetail(url) {
    try {
        const data = await (await fetch(url)).json();
        //se duvuelve solom lo necesario
        return { 
            name: data.name, 
            sprite: data.sprites?.front_default || '',
            types: data.types.map(t => t.type.name) //se agarra el nombre de los tipos
        };
    } catch (error) {
        return { name: 'Error', sprite: '', types: [] };
    }
}

//aqui se hace el html del poke
function renderPokemonList(pokemonArray) {
    if (!pokemonArray.length) {
        listElement.innerHTML = '<li>Sin resultados.</li>';
        return;
    }
    
    listElement.innerHTML = pokemonArray.map((p, i) => {
        //se calcula su numero basandose en el offset
        const pos = currentOffset + i + 1; 
        
        //se crean las clases para el tipo y aparezca ahi abajo
        const typesHtml = p.types.map(t => `<span class="type-badge">${cap(t)}</span>`).join('');
        
        //para el sprite
        const imgHtml = p.sprite = `<img src="${p.sprite}" alt="${p.name}" class="pokemon-thumb">`;
        
        //se hace la targeta del pokemon junto con un boton para mandarte a su pagina
        return `<li class="pokemon-card" onclick="window.location.href='busqueda.html?pokemon=${encodeURIComponent(p.name)}'">
            ${imgHtml}
            <div class="pokemon-info">
                <strong>${pos}. ${cap(p.name)}</strong>
                <div class="type-list">${typesHtml}</div>
            </div>
        </li>`;
    }).join('');
}

//botones de avanze
function updatePage(offset, total, pageCount) {
    prevBtn.disabled = offset === 0; //si estas en el inicio no funciona
    nextBtn.disabled = offset + pageSize >= total; //si estas en el final no funciona
    
    //se calcula la pagina en la que estas y el total de paginas
    const page = Math.floor(offset / pageSize) + 1;
    const totalPages = Math.ceil(total / pageSize);
    
    //se refresca la info
    pageInfo.textContent = `${offset + 1}-${offset + pageCount} de ${total} (${page}/${totalPages})`;
}

//esto para poner las mayusculas
function cap(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

//Añadir a la seccion de equipo
function addToTeam() {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonName = urlParams.get('pokemon');
    const pokeimg = document.querySelector('.pokemon-thumb').src;

    if (!pokemonName) return;
}