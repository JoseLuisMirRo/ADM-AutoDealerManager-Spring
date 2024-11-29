// auth.js
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("api_url/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token); // Guardar token
            location.href = "dashboard.html";
        } else {
            alert("Credenciales incorrectas");
        }
    } catch (error) {
        console.error("Error en autenticación:", error);
    }
});
