import { register } from "../services/authService.js";

document.getElementById("signForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmation = document.getElementById("confirmPassword").value;
    const messageElement = document.getElementById("message");

    try {

        if (!username || !password) {
            messageElement.textContent = "Username and password are required.";
            messageElement.style.color = "red";
            return;
        }


        if (password !== confirmation) {
            messageElement.textContent = "Passwords don't match.";
            messageElement.style.color = "red";
            return;
        }

        const result = await register(username, password);

        if (!result.ok) {
            messageElement.textContent = result.data.message;
            messageElement.style.color = "red";
            return;
        }

        messageElement.textContent = result.data.message;
        messageElement.style.color = "green";

        cleanForm();

        setTimeout(() => { window.location.href = "./index.html"; }, 3000);

    }
    catch (error) {

        console.error("Registration error:", error);
        messageElement.textContent = "An error occurred while creating the account.";
        messageElement.style.color = "red";
    }
});

function cleanForm() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
}