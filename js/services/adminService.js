import { API_URL } from "../config/api.js";


export async function createProduct(product) {

    try {

        const response = await fetch(`${API_URL}/products`, {

            method: "POST",
            headers: {"Content-Type": "application/json", "ngrok-skip-browser-warning": "true"},
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error("Error creating product");
        }

        return await response.json();
    }

    catch(error) {

        console.error("Create product error:", error);
        return null;
    }
}