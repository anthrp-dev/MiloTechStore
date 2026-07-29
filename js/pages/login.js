
localStorage.removeItem('user');



document.getElementById("loginForm").addEventListener("submit", async function(e) {
        e.preventDefault(); // Prevent form submission

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const messageElement = document.getElementById("message");

        try {
           const response = await fetch("assets/data/user.json");
            
            if (!response.ok) {
                throw new Error("This user does not exist.");
               
            }

            const users = await response.json();
            const userFound = users.find(u => u.username === username && u.password === password);

            if (userFound) {
                messageElement.textContent = "Login successful!";
                messageElement.style.color = "green";
                
            localStorage.setItem("user", JSON.stringify(userFound));
            cleanForm(); 
           
           setTimeout(() => {
               
                if (userFound.rol === "Admin") {
                 
                    window.location.href = "../admin.html"; 
                } else {
                   
                    window.location.href = "./home.html"; 
                }
            }, 2000);
            
        }
    

        else {
            messageElement.textContent = "Invalid username or password.";
            messageElement.style.color = "red";
        }
    }
        catch (error) {
            messageElement.textContent = error.message;
            messageElement.style.color = "red";
        }
    
});

function cleanForm() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    
}