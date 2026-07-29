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
        
        existsUser(username);
        
    }
  catch (error) {
    console.error("Error al crear la cuenta:", error);
    mostrarMensaje('Ocurrió un error al crear la cuenta. Por favor, inténtalo de nuevo.', 'error');
    }
});

function existsUser(username) {
    
}