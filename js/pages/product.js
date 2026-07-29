import { getCartItemCount } from "../utils/storage.js";
import * as cartService from "../services/cartService.js";
const cartBtn = document.getElementById("cart-btn");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartCloseBtn = document.getElementById("cart-close-btn");

let productsList = [];

async function getProducts() {
    try {
        const response = await fetch('assets/data/products.json');
        const data = await response.json();
        productsList = data;
        
       
        renderCatalog(productsList); 
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


function renderCatalog(products) { 
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p class="subtitle">${product.category}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="btn-primary btn-detail" data-id="${product.id}">Details</button>
        </div>
    `).join('');
  
    document.querySelectorAll('.btn-detail').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = Number(event.target.getAttribute('data-id'));
            showProductDetails(productId);
        });
    });
} 


function showProductDetails(id) { 
    const product = productsList.find(p => p.id == id);   
    
    const modal = document.getElementById('product-modal'); 
    const modalDetails = document.getElementById('modal-details');

    if (!product || !modal || !modalDetails) return;

  // to show in red if it's out of stock or in green if it's available
    const stockMessage = product.stock > 0 
        ? `<p style="color: #1b5e20; font-weight: bold; margin-bottom: 1rem;">En stock: ${product.stock} unidades</p>` 
        : `<p style="color: red ; font-weight: bold; margin-bottom: 1rem;">¡Agotado!</p>`;

    // HTML Injection 
    modalDetails.innerHTML = `
        <img src="${product.image}" alt="${product.title}" style="width: 100%; max-height: 250px; object-fit: contain; margin-bottom: 1rem;" />
        <h2 class="title">${product.title}</h2>
        <p class="subtitle" style="margin-bottom: 1rem; text-transform: uppercase;">${product.category}</p>
        <p style="margin-bottom: 1rem;">${product.description}</p>
        ${stockMessage}
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="btn-primary" id="add-to-cart-btn" ${product.stock === 0 ? 'disabled style="background-color: #ccc; cursor: not-allowed;"' : ''}>
            ${product.stock === 0 ? 'Sin existencias' : 'Add to Cart'}
        </button>
    `;
  
    modal.classList.remove('hidden');

    document.getElementById('close-modal-btn')?.addEventListener('click', () => {
        document.getElementById('product-modal')?.classList.add('hidden');
    });

    // conexión con el botón "Add to cart"
    document.getElementById("add-to-cart-btn")?.addEventListener("click", async () => {
        
        cartService.addToCart(product, 1);
        updateCartBadge();
        renderCartPanel();
        alert("Product added to the cart");
        modal.classList.add("hidden");
    });
}

function chargeUserName() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        const objectUser = JSON.parse(savedUser);
        const displayElement = document.getElementById('user-name-display');
        if (displayElement) {
            displayElement.textContent = objectUser.username;
        }
    } else {
        window.location.href = "index.html";
    }
}
    

function updateCartBadge() {
    const count = getCartItemCount();
    document.querySelector("#cart-count").textContent = count;
}


// Abre el panel lateral del carrito.
function openCartPanel() {
    renderCartPanel();      // Antes de mostrar el carrito, actualiza su contenido.
    cartPanel.classList.add("open");        // Agrega la clase "open" para ejecutar los estilos CSS del panel abierto.
    cartOverlay.classList.add("open");      // Hace visible el fondo oscuro (overlay).
}

// Cierra el panel del carrito.
function closeCartPanel() {
    cartPanel.classList.remove("open");     // Elimina la clase "open", haciendo que el panel vuelva a ocultarse.
    cartOverlay.classList.remove("open");       // Oculta el fondo oscuro.
}

// Genera dinámicamente el contenido del carrito.
function renderCartPanel() {
    const items = cartService.getCartItems();       // Obtiene los productos almacenados en el carrito.
    const container = document.getElementById("cart-items");        // Obtiene el contenedor donde se mostrarán los productos.
    
    // Recorre cada producto y genera su HTML.
    container.innerHTML = items.map(item => `
        <div class="cart-panel-item">
            <span>${item.product.title}</span>
            <span>x${item.quantity}</span>
        </div>
       `).join("");     // Une todos los elementos HTML en un solo string.
}

// Cuando el usuario hace click en el botón del carrito,
// se abre el panel lateral.
cartBtn?.addEventListener("click", openCartPanel);

// Cuando hace click en la X,
// se cierra el panel.
cartCloseBtn?.addEventListener("click", closeCartPanel);

// Si hace click sobre el fondo oscuro (overlay),
// también se cierra el carrito.
cartOverlay?.addEventListener("click", closeCartPanel);


async function initPage() {
    await cartService.init();   // Carga el carrito desde localStorage

    chargeUserName();
    await getProducts();

    updateCartBadge();
}

initPage();