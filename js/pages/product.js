import { getCartItemCount } from "../utils/storage.js";
import * as cartService from "../services/cartService.js";

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

    // HTML Injection
    modalDetails.innerHTML = `
        <img src="${product.image}" alt="${product.title}" style="width: 100%; max-height: 250px; object-fit: contain; margin-bottom: 1rem;" />
        <h2 class="title">${product.title}</h2>
        <p class="subtitle" style="margin-bottom: 1rem; text-transform: uppercase;">${product.category}</p>
        <p style="margin-bottom: 1.5rem;">${product.description}</p>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="btn-primary" id="add-to-cart-btn">Add to cart</button>
    `;
  
    modal.classList.remove('hidden');

    document.getElementById('close-modal-btn')?.addEventListener('click', () => {
        document.getElementById('product-modal')?.classList.add('hidden');
    });

    // conexión con el botón "Add to cart"
    document.getElementById("add-to-cart-btn")?.addEventListener("click", async () => {

    }

    }

    function chargeUserName()
    {
        const savedUser= localStorage.getItem('user');
        if(savedUser)
        {
            const objectUser=JSON.parse(savedUser)
            const displayElement=document.getElementById('user-name-display');
            if(displayElement){
                displayElement.textContent=objectUser.username;
            }
        }else{
            window.location.href="index.html"
        }
    }

function updateCartBadge() {
    const count = getCartItemCount();
    document.querySelector("#cart-count").textContent = count
}

chargeUserName();
getProducts();
updateCartBadge();