import { API_URL } from "../config/api.js";

console.log("API_URL:", API_URL);

export async function getAllProducts() {
    try {

        const response = await fetch(`${API_URL}/products`, {
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        return await response.json();

    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProductById(productId) {

    try {

        const products = await getAllProducts();

        const product = products.find((p) => p.id === productId);

        if (!product) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        return product;

    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return null;
    }

}

export async function reduceStock(items) {

    try {

        const response = await fetch(`${API_URL}/products/reduce-stock`, {
            method: "POST",
            headers: {"Content-Type": "application/json" , "ngrok-skip-browser-warning": "true"},
            body: JSON.stringify(items)
        });


        if (!response.ok) {
            throw new Error("Could not update stock");
        }

        return await response.json();

    } catch(error) {

        console.error("Stock update error:", error);
        return null;

    }
}