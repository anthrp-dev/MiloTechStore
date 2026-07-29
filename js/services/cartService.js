import { saveCart, loadCart, clearCart } from '../utils/storage.js';
import { getAllProducts } from './productService.js';

let cartItems = [];

export async function init() {

    const storedCart = loadCart();

    const allProducts = await getAllProducts();

    cartItems = storedCart.map(entry => {
        const product = allProducts.find(p => p.id === entry.productId);

        if (!product) return null;

        return {
            product,
            quantity: entry.quantity
        };
    })
    .filter(item => item !== null);
}

export function getCartItems() {
    return cartItems;
}

export function addToCart(product, quantity = 1) {
    const existingItem = cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({ product, quantity });
    }

    saveCart(cartItems);
}

export function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.product.id !== productId);
    saveCart(cartItems);
}

export function clearCartItems() {
    cartItems = [];
    clearCart();
}

export function calculateTotal() {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
}

export function updateQuantity(productId, quantity) {
    const item = cartItems.find(item => item.product.id === productId);

    if (!item) return;

    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    item.quantity = quantity;
    saveCart(cartItems);
}