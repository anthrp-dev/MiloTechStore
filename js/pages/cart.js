// Importa todas las funciones relacionadas con el carrito.
// Se accede a ellas mediante cartService.nombreFuncion().
import * as cartService from "../services/cartService.js";
import { formatCardNumber, formatExpiry, formatCvv, validateCheckoutData } from "../utils/validators.js";

// Obtiene referencias a los elementos del HTML que controlan el carrito.
const cartContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartEmpty = document.querySelector("#cart-empty");
const cartContent = document.querySelector("#cart-content");
const clearBtn = document.querySelector("#clear-cart-btn");
const checkoutBtn = document.querySelector("#checkout-btn");
const checkoutModal = document.querySelector("#checkout-modal");
const closeCheckoutBtn = document.querySelector("#close-checkout-btn");
const checkoutFormView = document.querySelector("#checkout-form-view");
const checkoutProcessingView = document.querySelector("#checkout-processing-view");
const checkoutSuccessView = document.querySelector("#checkout-success-view");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutModalTotal = document.querySelector("#checkout-modal-total");
const cardNumberInput = document.querySelector("#card-number");
const cardExpiryInput = document.querySelector("#card-expiry");
const cardCvvInput = document.querySelector("#card-cvv");

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
        
        if (cartService.getCartItems().length === 0) return;
        openCheckoutModal();
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

function openCheckoutModal() {
   checkoutFormView.classList.remove("hidden");
    checkoutProcessingView.classList.add("hidden");
    checkoutSuccessView.classList.add("hidden");

    checkoutModalTotal.textContent = `$${cartService.calculateTotal().toFixed(2)}`;
    checkoutModal.classList.remove("hidden");
}

function closeCheckoutModal() {
    checkoutModal.classList.add("hidden");
}

closeCheckoutBtn.addEventListener("click", closeCheckoutModal);

cardNumberInput.addEventListener("input", () => {
    cardNumberInput.value = formatCardNumber(cardNumberInput.value);
});

cardExpiryInput.addEventListener("input", () => {
    cardExpiryInput.value = formatExpiry(cardExpiryInput.value);
});

cardCvvInput.addEventListener("input", () => {
    cardCvvInput.value = formatCvv(cardCvvInput.value);
});

function validateCheckoutForm() {
    const nameInput = document.querySelector("#cardholder-name");
    const errorName = document.querySelector("#error-name");
    const errorCard = document.querySelector("#error-card");
    const errorExpiry = document.querySelector("#error-expiry");
    const errorCvv = document.querySelector("#error-cvv");

    // Limpieza de errores previos
    [nameInput, cardNumberInput, cardExpiryInput, cardCvvInput].forEach(input =>
        input.classList.remove("invalid")
    );

    [errorName, errorCard, errorExpiry, errorCvv].forEach(element =>
        element.textContent = ""
    );

    // Obtenemos de validator.js el resultado de cada regla
    const result = validateCheckoutData({
        name: nameInput.value,
        cardNumber: cardNumberInput.value,
        expiry: cardExpiryInput.value,
        cvv: cardCvvInput.value
    });

    // Mensajes de error

    if (!result.name) {
        errorName.textContent = "Enter your full name";
        nameInput.classList.add("invalid");
    }

    if (!result.cardNumber) {
        errorCard.textContent = "Card number must have 16 digits";
        cardNumberInput.classList.add("invalid");
    }

    if (!result.expiry) {
        errorExpiry.textContent = "Use MM/YY format";
        cardExpiryInput.classList.add("invalid");
    }

    if (!result.cvv) {
        errorCvv.textContent = "CVV must have 3 digits";
        cardCvvInput.classList.add("invalid");
    }

    return result.name && result.cardNumber && result.expiry && result.cvv;
}

checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateCheckoutForm()) return;

    checkoutFormView.classList.add("hidden");
    checkoutProcessingView.classList.remove("hidden");

    setTimeout(() => {
        checkoutProcessingView.classList.add("hidden");
        checkoutSuccessView.classList.remove("hidden");

        const orderNumber = "MS-" + Math.floor(10000 + Math.random() * 90000);
        document.querySelector("#order-number").textContent = `Order #${orderNumber}`;

        cartService.clearCartItems();

        setTimeout(() => {
            window.location.href = "home.html";
        }, 2500);
        
    }, 2000);
})

// Inicia la carga de la página.
init();
chargeUserName();






    