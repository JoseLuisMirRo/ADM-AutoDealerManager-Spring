(() => {
    let currentPath = window.location.pathname;
    console.log(currentPath);
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    const userDataField = document.getElementById('user-data');
    const userRoleField = document.getElementById('user-role');

    let userData =localStorage.getItem('userData');
    userDataField.innerHTML = userData;

    let userRole = (localStorage.getItem('role') === '1')
        ? 'Administrador'
        : 'Empleado';

    userRoleField.innerHTML = userRole;

})();

const logout = () => {
    Swal.fire({
        icon: "warning",
        title: "¿Desea cerrar sesión?",
        showCancelButton: true,
        confirmButtonText: "Sí, cerrar sesión",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#208c7d",
        cancelButtonColor: "#dc3545"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('token');
            window.location.href = '/client/index.html';
        }
    });
};

