import * as cartService from "../services/cartService.js";

const cartContainer = document.querySelector("#cart-items");
const totalPrice = document.querySelector("#total-price");

async function init() {
    await cartService.init();
    render();
}

async function render() {
    
    const cartItems = cartService.getCartItems();

    const itemsHTML = cartItems.map(item => `
        <div class="cart-item">
            <p>${item.product.name} - $${item.product.price} x ${item.quantity}</p>
        </div>
    `).join("");

    cartContainer.innerHTML = itemsHTML;

    totalPrice.textContent = `$${cartService.calculateTotal().toFixed(2)}`;
}

init();