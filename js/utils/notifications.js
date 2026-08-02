export function showToast(message, type = "success") {

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    const toastIcon = document.getElementById("toast-icon");

    if (!toast) return;

    toastMessage.textContent = message;

    toast.classList.remove("error");

    if (type === "success") {
        toastIcon.textContent = "✅";
    } else {
        toast.classList.add("error");
        toastIcon.textContent = "❌";
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}