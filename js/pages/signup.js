document.getElementById("signForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value; 
    const password = document.getElementById("password").value;
    const confirmation = document.getElementById("confirmPassword").value;
    const messageElement = document.getElementById("message");

    try{
        if(password !== confirmation){
            messageElement.textContent = "Passwords don't match.";
            messageElement.style.color = "red";
            return;
        }
        
       if(existsUser(username)){messageElement.textContent = "Username already exists.";
        messageElement.style.color = "red";
        return;
       }
       
        
    }
  catch (error) {
    console.error("Error al crear la cuenta:", error);
    mostrarMensaje('Ocurrió un error al crear la cuenta. Por favor, inténtalo de nuevo.', 'error');
    }
});

function existsUser(username) {
    fetch("assets/data/user.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar los usuarios.");
            }
            return response.json();
        })
        .then(users => {
            const userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
            if (userExists) {
                mostrarMensaje('El nombre de usuario ya está registrado', 'error');
            } 
        })
        .catch(error => {
            console.error("Error al verificar la existencia del usuario:", error);
            mostrarMensaje('Ocurrió un error al verificar el nombre de usuario. Por favor, inténtalo de nuevo.', 'error');
        });
}