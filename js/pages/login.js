import { login } from "../services/authService.js";
import { showToast } from "../utils/notifications.js";

document.getElementById("loginForm").addEventListener("submit", async function(e) {
        e.preventDefault(); // Prevent form submission

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const messageElement = document.getElementById("message");

        try {

           const result = await login(username, password);
            
            if (!result.ok) {

            messageElement.textContent = result.data.message;
            messageElement.style.color = "red";

            return;
            }

            const user = result.data;

            messageElement.textContent = "Login successful!";
            messageElement.style.color = "green";
            showToast("Welcome back!");

            localStorage.removeItem('user');

            localStorage.setItem("user", JSON.stringify(user));

            cleanForm();

            setTimeout(() => {

                if (user.roleId === 2) {
                    window.location.href = "./admin.html";
                } else {
                    window.location.href = "/home.html";
                }
            }, 2000);
        }
        
        catch (error) {

            console.error("Login error:", error);
            showToast("Invalid username or password", "error");
        }
    
});

function cleanForm() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    
}