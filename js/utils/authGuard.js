export function requireAuth() {

    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
        window.location.href = "index.html";
        return null;
    }

    return JSON.parse(savedUser);
}


export function requireAdmin() {

    const user = requireAuth();

    if (!user) return null;

    if (user.roleId !== 2) {
        window.location.href = "home.html";
        return null;
    }

    return user;
}