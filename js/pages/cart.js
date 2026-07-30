// Importa todas las funciones relacionadas con el carrito.
// Se accede a ellas mediante cartService.nombreFuncion().
import * as cartService from "../services/cartService.js";

// Obtiene referencias a los elementos del HTML que controlan el carrito.
const cartContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartEmpty = document.querySelector("#cart-empty");
const cartContent = document.querySelector("#cart-content");
const clearBtn = document.querySelector("#clear-cart-btn");
const checkoutBtn = document.querySelector("#checkout-btn");

// Punto de entrada de la página.
// Inicializa el servicio y luego dibuja el carrito.
async function init() {
    await cartService.init();
    render();
    setupEventListeners();
}

// Actualiza toda la interfaz del carrito según su estado actual.
function render() {
    
    // Obtiene los productos almacenados en el carrito.
    const cartItems = cartService.getCartItems();

    // Si el carrito está vacío, muestra el mensaje correspondiente.
    if (cartItems.length === 0) {
        cartContainer.innerHTML = "";   // Limpia productos anteriores.
        cartEmpty.classList.remove("hidden");   // Muestra el mensaje "carrito vacío".
        cartContent.classList.add("hidden");    // Oculta el resumen y el total.
        return;
    }

    // Si hay productos, oculta el mensaje de vacío y muestra el resumen.
    cartEmpty.classList.add("hidden");
    cartContent.classList.remove("hidden");

    // Genera dinámicamente el HTML de cada producto del carrito.
    cartContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-id="${item.product.id}">
            <img src="${item.product.image}" alt="${item.product.title}">
            
            <div class="cart-item-info">
                <h3>${item.product.title}</h3>
                <p class="cart-item-price">$${item.product.price.toFixed(2)}</p>
            </div>
            
            <div class="cart-item-quantity">
                <button class="qty-decrease">-</button>
                <span>${item.quantity}</span>
                <button class="qty-increase">+</button>
            </div>
            
            <p class="cart-item-subtotal">$${(item.product.price * item.quantity).toFixed(2)}</p>
            <button class="cart-item-remove">🗑</button>
        </div>
    `).join(""); // Une todos los elementos del array en un único string HTML.

     // Actualiza el total del carrito.
     cartTotal.textContent = `$${cartService.calculateTotal().toFixed(2)}`;
}

// Configura los eventos que permiten interactuar con el carrito.
function setupEventListeners() {
    cartContainer.addEventListener("click", (event) => {
        const cartItemElement = event.target.closest(".cart-item");
        if (!cartItemElement) return;

        const productId = Number(cartItemElement.dataset.id);
        const currentItem = cartService.getCartItems().find(
            item => item.product.id === productId
        );

        if (event.target.classList.contains("qty-increase")) {
            cartService.updateQuantity(productId, currentItem.quantity + 1);
            render();
        }

        if (event.target.classList.contains("qty-decrease")) {
            cartService.updateQuantity(productId, currentItem.quantity - 1);
            render();
        }

        if (event.target.classList.contains("cart-item-remove")) {
            cartService.removeFromCart(productId);
            render();
        }
    });

    clearBtn.addEventListener("click", () => {
        cartService.clearCartItems();
        render();
    });

    checkoutBtn.addEventListener("click", () => {
        const cartItems = cartService.getCartItems();

        if (cartItems.length === 0) return;

        const total = cartService.calculateTotal().toFixed(2);
        alert(`Thank you for your purchase!\nTotal charged: $${total}`);

        cartService.clearCartItems();
        render();
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


// Inicia la carga de la página.
init();
chargeUserName();






    