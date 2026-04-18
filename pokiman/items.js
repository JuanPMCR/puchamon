let currentItem = null;

async function fetchingItem(items) {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/item/" + items);
        if (!response.ok) {
            throw new Error("Error");
        }
        const data = await response.json();
        console.log(data);
        await changeItem(data);
    } catch (error) {
        console.error("Error fetching", error);
    }
}

function searchItems() {
    let busq = document.getElementById("buscarItem").value.toLowerCase();
    fetchingItem(busq);
}

async function changeItem(item) {
    currentItem = item;
    let name = document.getElementById("nomItem");
    let id = document.getElementById("idItem");
    let cost = document.getElementById("costItem");
    let attribute = document.getElementById("attributesItem");
    let category = document.getElementById("categoryItem");
    
    name.textContent = item.name || "N/A";
    id.textContent = item.id || "N/A";
    cost.textContent = item.cost || "N/A";
    attribute.textContent = item.attributes?.length > 0 ? item.attributes.map(a => a.name).join(", ") : "N/A";
    category.textContent = item.category?.name || item.category || "N/A";
}