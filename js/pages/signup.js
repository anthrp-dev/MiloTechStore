document.getElementById("signupForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value; 
    const password = document.getElementById("password").value;
    const confirmation = document.getElementById("confirmation").value;
    const messageElement = document.getElementById("message");

    try{
        if(password !== confirmation){
            messageElement.textContent = "Passwords do not match.";
            messageElement.style.color = "red";
            return;
        }

        let users = JSON.parse(localStorage.getItem("users"));

        if (!users) {
      try {
        // Cargar los usuarios desde la ruta de tu proyecto
        const response = await fetch('../../data/user.json');
        users = await response.json();
      } catch (error) {
        users = [];
      }

      const userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (userExists) {
      mostrarMensaje('El nombre de usuario ya está registrado', 'error');
      return;
    }

    const newUser = {
      username: username,
      password: password,
      rol: "customer"
    };

    // 5. Guardar en la lista y actualizar localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users, null, 2));

    mostrarMensaje('¡Cuenta creada con éxito!', 'success');
    signForm.reset();
  };

  function mostrarMensaje(texto, tipo) {
    if (messageElement) {
      messageElement.textContent = texto;
      messageElement.style.color = tipo === 'error' ? '#e63946' : '#2a9d8f';
    } else {
      alert(texto);
    }
  }
}
  catch (error) {
    console.error("Error al crear la cuenta:", error);
    mostrarMensaje('Ocurrió un error al crear la cuenta. Por favor, inténtalo de nuevo.', 'error');
    }
});
