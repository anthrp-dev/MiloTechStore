import * as adminService from "../services/adminService.js";
import { showToast } from "../utils/notifications.js";
import { requireAdmin } from "../utils/authGuard.js";

const openAddModalBtn = document.getElementById('open-add-product-btn');
const closeAddModalBtn = document.getElementById('close-add-product-btn');
const addProductModal = document.getElementById('add-product-modal');
const addProductForm = document.getElementById('add-product-form');
const saveProductBtn = addProductForm?.querySelector("button[type='submit']");

const user = requireAdmin();

if (!user) {
    throw new Error("Unauthorized");
}

openAddModalBtn?.addEventListener('click', () => {
    addProductModal?.classList.remove('hidden');
});

closeAddModalBtn?.addEventListener('click', () => {
    addProductModal?.classList.add('hidden');
});

addProductForm?.addEventListener('submit', async (event) => {

    event.preventDefault();

    const newProduct = {
        title: document.getElementById('new-title').value.trim(),
        price: Number(document.getElementById('new-price').value),
        description: document.getElementById('new-description').value.trim(),
        category: "Electronics",
        image: document.getElementById('new-image').value.trim(),
        stock: Number(document.getElementById('new-stock').value)
    };

    if (!newProduct.title) {
        showToast("Product name is required", "error");
        return;
    }

    if (isNaN(newProduct.price) || newProduct.price <= 0) {
        showToast("Price must be greater than zero", "error");
        return;
    }

    if (isNaN(newProduct.stock) || newProduct.stock < 0) {
        showToast("Stock cannot be negative", "error");
        return;
    }

    if (!newProduct.description) {
        showToast("Description is required", "error");
        return;
    }

    if (!newProduct.image) {
        showToast("Image URL is required", "error");
        return;
    }

    try {

        saveProductBtn.disabled = true;
        saveProductBtn.textContent = "Saving...";

        const createdProduct = await adminService.createProduct(newProduct);

        if (createdProduct) {

            showToast("✅ Product created successfully");

            addProductForm.reset();
            addProductModal.classList.add('hidden');

            setTimeout(() => {
                window.location.reload();
            }, 1200);
        }

    } catch (error) {

        console.error(error);
        showToast("Could not create product", "error");

    } finally {

        saveProductBtn.disabled = false;
        saveProductBtn.textContent = "Save to Inventory";
    }
});