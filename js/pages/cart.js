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
            <img class="cart-img"
            src="${item.product.image}"
            alt="${item.product.title}">
            
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

// ===========================
// CONFIGURACIÓN DE EVENTOS
// ===========================

function setupEventListeners() {

     // Escucha todos los clicks que ocurran dentro del contenedor del carrito.
    // Se utiliza delegación de eventos para no agregar un listener a cada botón.

    cartContainer.addEventListener("click", (event) => {
        const cartItemElement = event.target.closest(".cart-item");      // Busca el producto del carrito al que pertenece el botón presionado.
        if (!cartItemElement) return;

        const productId = Number(cartItemElement.dataset.id);        // Obtiene el id del producto desde el atributo data-id del HTML.
        const currentItem = cartService.getCartItems().find(        // Busca ese mismo producto dentro del carrito almacenado en memoria.
            item => item.product.id === productId
        );

        if (event.target.classList.contains("qty-increase")) {
            cartService.updateQuantity(productId, currentItem.quantity + 1);        // aumenta la cantidad del producto.
            render();
        }

        if (event.target.classList.contains("qty-decrease")) {
            cartService.updateQuantity(productId, currentItem.quantity - 1);        // disminuye la cantidad.
            render();
        }

        if (event.target.classList.contains("cart-item-remove")) {      
            cartService.removeFromCart(productId);      // elimina completamente el producto.
            render();
        }
    });

    clearBtn.addEventListener("click", () => {      // Vacía completamente el carrito.
        cartService.clearCartItems();
        render();
    });

    checkoutBtn.addEventListener("click", () => {       // Abre el modal de checkout.
        
        if (cartService.getCartItems().length === 0) return;
        openCheckoutModal();
    });
}

// ===========================
// CARGA EL NOMBRE DEL USUARIO
// ===========================

function loadUserName() {
    const savedUser = localStorage.getItem('user');     // Obtiene el usuario guardado en localStorage.
    if (savedUser) {
        const objectUser = JSON.parse(savedUser);       // Convierte el texto JSON nuevamente en un objeto.
        const displayElement = document.getElementById('user-name-display');        // Obtiene el elemento donde se mostrará el nombre.
        if (displayElement) {
            displayElement.textContent = objectUser.username;       // Muestra el nombre del usuario
        }
    } else {
        window.location.href = "index.html";        // Si no existe un usuario guardado redirige a la página de inicio de sesión.
    }
}

// ===========================
// ABRE EL MODAL DE CHECKOUT
// ===========================

function openCheckoutModal() {
   checkoutFormView.classList.remove("hidden");     // Muestra el formulario.
    checkoutProcessingView.classList.add("hidden");     // Oculta la vista de procesamiento.
    checkoutSuccessView.classList.add("hidden");        // Oculta la vista de éxito.


    checkoutModalTotal.textContent = `$${cartService.calculateTotal().toFixed(2)}`;     // Actualiza el total del pedido.
    checkoutModal.classList.remove("hidden");       // Hace visible el modal.
}

// ===========================
// CIERRA EL MODAL
// ===========================

function closeCheckoutModal() {
    checkoutModal.classList.add("hidden");
}

closeCheckoutBtn.addEventListener("click", closeCheckoutModal);     // Cierra el modal al presionar la X.

// ===========================
// FORMATEO AUTOMÁTICO
// ===========================

cardNumberInput.addEventListener("input", () => {       
    cardNumberInput.value = formatCardNumber(cardNumberInput.value);        // Formatea el número de tarjeta mientras el usuario escribe.
});

cardExpiryInput.addEventListener("input", () => {
    cardExpiryInput.value = formatExpiry(cardExpiryInput.value);        // Formatea automáticamente la fecha MM/YY.
});

cardCvvInput.addEventListener("input", () => {
    cardCvvInput.value = formatCvv(cardCvvInput.value);     // Solo permite tres dígitos para el CVV.
});

// ===========================
// VALIDACIÓN DEL FORMULARIO
// ===========================

function validateCheckoutForm() {

    // Referencias a los elementos del formulario.

    const nameInput = document.querySelector("#cardholder-name");
    const errorName = document.querySelector("#error-name");
    const errorCard = document.querySelector("#error-card");
    const errorExpiry = document.querySelector("#error-expiry");
    const errorCvv = document.querySelector("#error-cvv");

    // Elimina las marcas de error anteriores.
    [nameInput, cardNumberInput, cardExpiryInput, cardCvvInput].forEach(input =>
        input.classList.remove("invalid")
    );

    [errorName, errorCard, errorExpiry, errorCvv].forEach(element =>
        element.textContent = ""
    );

    // Ejecuta todas las validaciones definidas en validator.js.
    const result = validateCheckoutData({
        name: nameInput.value,
        cardNumber: cardNumberInput.value,
        expiry: cardExpiryInput.value,
        cvv: cardCvvInput.value
    });

    // Mensajes de error

    if (!result.name) {
        errorName.textContent = "Enter your full name";     // Nombre inválido.
        nameInput.classList.add("invalid");
    }

    if (!result.cardNumber) {
        errorCard.textContent = "Card number must have 16 digits";      // Tarjeta inválida.
        cardNumberInput.classList.add("invalid");
    }

    if (!result.expiry) {
        errorExpiry.textContent = "Use MM/YY format";       // Fecha inválida.
        cardExpiryInput.classList.add("invalid");
    }

    if (!result.cvv) {
        errorCvv.textContent = "CVV must have 3 digits";        // CVV inválido.
        cardCvvInput.classList.add("invalid");
    }

    // Devuelve true únicamente si todas las validaciones fueron correctas.

    return result.name && result.cardNumber && result.expiry && result.cvv;
}

// ===========================
// ENVÍO DEL FORMULARIO
// ===========================

checkoutForm.addEventListener("submit", (event) => {        // Evita que el formulario recargue la página.
    event.preventDefault();

    if (!validateCheckoutForm()) return;        // Si hay errores, detiene el proceso.

    checkoutFormView.classList.add("hidden");       // Oculta el formulario.
    checkoutProcessingView.classList.remove("hidden");      // Muestra la vista de procesamiento.

    setTimeout(() => {      // Simula una espera de 2 segundos.
        checkoutProcessingView.classList.add("hidden");     // Oculta la vista de procesamiento.
        checkoutSuccessView.classList.remove("hidden");     // Muestra la vista de éxito.     

        const orderNumber = "MS-" + Math.floor(10000 + Math.random() * 90000);      // Genera un número de orden aleatorio.
        document.querySelector("#order-number").textContent = `Order #${orderNumber}`;      // Muestra el número de orden.

        cartService.clearCartItems();       // Vacía el carrito.

        setTimeout(() => {      // Espera unos segundos antes de volver al inicio.
            window.location.href = "home.html";
        }, 2500);
        
    }, 2000);
})

// Inicia la carga de la página.
init();
loadUserName();






    