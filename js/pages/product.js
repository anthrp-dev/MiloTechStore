import { getCartItemCount } from "../utils/storage.js";
import * as cartService from "../services/cartService.js";


const cartOverlay = document.getElementById("cart-overlay");
const cartPanel = document.getElementById("cart-panel");
const cartPanelBody = document.getElementById("cart-items")
const cartPanelTotal = document.getElementById("panel-cart-total")
const cartBtn = document.getElementById("cart-btn");
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
        await cartService.init();
        cartService.addToCart(product, 1);
        updateCartBadge();
        renderCartPanel();

        alert("Product added to the cart");
        modal.classList.add("hidden");
    });
}

function loadUserName() {
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
    const badgeElement = document.querySelector("#cart-count");
    if (badgeElement) {
        badgeElement.textContent = count;
    }
}

function openCartPanel() {
    renderCartPanel();      
    cartPanel?.classList.add("open");        
    cartOverlay?.classList.add("open");      
}

function closeCartPanel() {
    cartPanel?.classList.remove("open");     
    cartOverlay?.classList.remove("open");       
}

cartBtn?.addEventListener("click", openCartPanel);
cartCloseBtn?.addEventListener("click", closeCartPanel);
cartOverlay?.addEventListener("click", closeCartPanel);

async function renderCartPanel() {
    
    if (!cartPanelBody || !cartPanelTotal) return;

    await cartService.init();
    const cartItems = cartService.getCartItems();          
    
    if (cartItems.length === 0) {
        cartPanelBody.innerHTML = `<p class="cart-panel-empty">Your cart is empty</p>`;
        cartPanelTotal.innerHTML = "$0.00";
        return;
    }

    cartPanelBody.innerHTML = cartItems.map(item => `
        <div class="cart-panel-item" data-id="${item.product.id}">
            <img src="${item.product.image}" alt="${item.product.title}">
            <div class="cart-panel-item-info">
                <h4>${item.product.title}</h4>
                <p class="cart-panel-item-price">$${(item.product.price * item.quantity).toFixed(2)}</p>
                <div class="cart-panel-item-quantity">
                    <button class="panel-qty-decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="panel-qty-increase">+</button>
                </div>
            </div>
            <button class="cart-panel-item-remove">✕</button>
        </div>
    `).join("");     

    cartPanelTotal.textContent = `$${cartService.calculateTotal().toFixed(2)}`;
}

cartPanelBody?.addEventListener("click", async (event) => {
    const cartPanelItemElement = event.target.closest(".cart-panel-item");

    if (!cartPanelItemElement) return;

    const productId = Number(cartPanelItemElement.dataset.id);
    const currentItem = cartService.getCartItems().find(
        item => item.product.id === productId
    );

    if (event.target.classList.contains("panel-qty-increase")) {
        cartService.updateQuantity(productId, currentItem.quantity + 1);
        renderCartPanel();
        updateCartBadge();
    }

    if (event.target.classList.contains("panel-qty-decrease")) {
        cartService.updateQuantity(productId, currentItem.quantity - 1);
        renderCartPanel();
        updateCartBadge();
    }

    if (event.target.classList.contains("cart-panel-item-remove")) {
        cartService.removeFromCart(productId);
        renderCartPanel();
        updateCartBadge();
    }
});

async function initPage() {
    await cartService.init();   
    loadUserName();
    await getProducts();
    updateCartBadge();
}

// Logic to add new products only admin users can access this page
const openAddModalBtn = document.getElementById('open-add-product-btn');
const closeAddModalBtn = document.getElementById('close-add-modal-btn');
const addProductModal = document.getElementById('add-product-modal');
const addProductForm = document.getElementById('add-product-form');

openAddModalBtn?.addEventListener('click', () => {
    addProductModal?.classList.remove('hidden');
});

closeAddModalBtn?.addEventListener('click', () => {
    addProductModal?.classList.add('hidden');
});

addProductForm?.addEventListener('submit', (event) => {
    event.preventDefault(); 

    // get the values from the form inputs
    const title = document.getElementById('new-title').value;
    const price = parseFloat(document.getElementById('new-price').value);
    const stock = parseInt(document.getElementById('new-stock').value);
    const image = document.getElementById('new-image').value;
    const description = document.getElementById('new-description').value;

    // Generate a new unique ID for the product
    const newId = productsList.length > 0 
        ? Math.max(...productsList.map(p => p.id)) + 1 
        : 1;

    // Create a new product object   
    const newProduct = {
        id: newId,
        title: title,
        price: price,
        description: description,
        category: "electronics", 
        image: image,
        rating: { rate: 0, count: 0 }, 
        stock: stock
    };
    
    productsList.unshift(newProduct);
    renderCatalog(productsList);
   
    addProductForm.reset();
    addProductModal.classList.add('hidden');
});

initPage();