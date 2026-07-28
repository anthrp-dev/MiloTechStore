const CART_STORAGE_KEY = 'cart';

export function saveCart(cartItems) {

    const cartData = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
    }));

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
}

export function loadCart() {

    const cartData = localStorage.getItem(CART_STORAGE_KEY);

    if (!cartData) {
        return [];
    }

    return JSON.parse(cartData);
}

export function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
}

export function getCartItemCount() {
    const cart = loadCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
}