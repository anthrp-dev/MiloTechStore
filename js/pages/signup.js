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
        
       if(await existsUser(username)){messageElement.textContent = "Username already exists.";
        messageElement.style.color = "red";
        return;
       }


       await saveUser({ username: username, password: password });
    
    messageElement.textContent = "User successfully registered.";
    messageElement.style.color = "green";

       cleanForm(); 
        
    }
  catch (error) {
    console.error("Error creating account:", error);
    mostrarMensaje('An error occurred while creating the account. Please try again.', 'error');
    }
});

async function getUsers() {
    let storedUsers = localStorage.getItem("users");

    if (!storedUsers) {
        try {
            const response = await fetch("assets/data/user.json");
            if (!response.ok) throw new Error("Error al cargar JSON");
            
            const initialUsers = await response.json();
            localStorage.setItem("users", JSON.stringify(initialUsers));
            return initialUsers;
        } catch (error) {
            console.error("Error leyendo JSON:", error);
            return [];
        }
    }

    return JSON.parse(storedUsers);
}

async function existsUser(username) {
    const users = await getUsers();
    return users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
}

async function saveUser(newUser) {
    const users = await getUsers();
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

     setTimeout(() => {
                    window.location.href = "./index.html";         
            }, 3000);
}

function cleanForm() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
}