const URL = 'http://localhost:8080';
let form = document.getElementById('loginForm');
let formButton = document.getElementById('formButton');
let spinner = document.getElementById('loginSpinner');

formButton.addEventListener('click', async event => {
    if(!form.checkValidity()){
        event.preventDefault();
    } else {
        spinner.classList.remove('visually-hidden');
        await login();
    }
    form.classList.add('was-validated');
});

const login = async () => {
    let dto = {
        password: document.getElementById('password').value,
        username: document.getElementById('username').value
    }
    console.log(dto);
    await fetch(`${URL}/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(dto)
    }).then(response => response.json()).then(response => {
        console.log(response);
        if(response.status === 'OK'){
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.roleId);
            localStorage.setItem('employeeId', response.data.employeeId);
            localStorage.setItem('userData', response.data.userData)
            if(response.data.roleId === 1) window.location.href = 'src/view/admin/car/car-catalog.html';
            if(response.data.roleId === 2) window.location.href = 'src/view/operator/car/car-catalog-operator.html';
        
        }else if (response.code === 404) {
            spinner.classList.add('visually-hidden');
            Swal.fire({
                icon: 'error',
                title: 'Error al iniciar sesión',
                text: 'Usuario o contraseña incorrectos',
                confirmButtonText: 'Reintentar',
                confirmButtonColor: '#ff0000'

            });
        } else {
            spinner.classList.add('visually-hidden');
        }
    }).catch((error) => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: 'Ocurrió un error al iniciar sesión, intente de nuevo',
            confirmButtonText: 'Reintentar',
            confirmButtonColor: '#ff0000'
        });
    });
}