export async function getAllProducts() {
    try {
        const response = await fetch("assets/data/products.json");

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        return await response.json();
        
    } catch (error) {
        console.error("Error fetching products:", error);
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
