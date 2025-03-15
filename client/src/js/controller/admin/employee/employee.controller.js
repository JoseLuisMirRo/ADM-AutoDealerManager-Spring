const URL = 'http://localhost:8080'
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const mainContent = document.getElementById('mainContent');

let employeeList = []
let employee = {}

const validateSessionAndRole = (requiredRoles) => {
    if(!token) { //Redirigir a login si no hay sesion validada
        window.location.href = '../../../../index.html';
        return false;
    }

    if(!requiredRoles.includes(role)){
        Swal.fire({
            title: '¡Acceso denegado!',
            text: 'Error 401 - No cuentas con los permisos necesarios para acceder a esta página.',
            icon: 'error',
            confirmButtonText: 'Aceptar y volver al inicio',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showCancelButton: true,
            cancelButtonText: 'Cerrar sesión',
        }).then((result) => {
            if(!result.isConfirmed){
                localStorage.clear();
                window.location.href = '../../../../index.html';
            }else{
                window.location.href = '../../operator/car/car.html';
            }
     
        });
        return false;
    }
    mainContent.classList.remove('hidden');
    return true;
};

const findAllEmployees = async () => {
    await fetch(`${URL}/adm/employee`, {
        method: 'GET',
        headers: {
            'AUthorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => response.json()).then(response => {
        employeeList = response.data;
    }).catch(console.log);
}

const loadTable = async () => {
    await findAllEmployees();

    // Obtener el ID del usuario actual
    const employeeId = parseInt(localStorage.getItem('employeeId'), 10);

    // Filtrar lista de empleados para no mostrar el usuario actual
    const employeeListFiltered = employeeList.filter(employee => employee.id !== employeeId);

    // Crear contenido de la tabla
    let content = '';
    employeeListFiltered.forEach(employee => {
        content += `<tr>
            <td>${employee.username}</td>
            <td>${employee.name}</td>
            <td>${employee.lastname}</td>
            <td>${employee.surname}</td>
            <td>
                ${employee.status ? `<span class="badge-active-status">Activo</span>` : `<span class="badge-inactive-status">Inactivo</span>`}
            </td>
            <td>
                <div class="btn-group" role="group" aria-label="Grupo de botones">
                    <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#updateEmployeeModal" data-employee-id="${employee.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-outline-warning" onclick="confirmChangeStatusEmployee(${employee.id},${employee.status})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
                            <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>`;
    });

    if ($.fn.DataTable.isDataTable('#employee-table')) {
        $('#employee-table').DataTable().destroy();
    }

    // Insertar contenido en el tbody
    const tbody = document.getElementById('employee-tbody');
    tbody.innerHTML = content;
    document.getElementById('custom-search').value = '';

    // Inicializar DataTable
    const table = $('#employee-table').DataTable({
        dom: "lrtip",
        paging: true,
        searching: true,
        ordering: true,
        responsive: true,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
        },
        columnDefs: [
            { className: "text-center align-middle", targets: [0, 1, 2, 3, 4, 5] },
            { orderable: false, targets: [4, 5] },
            { searchable: false, targets: [4, 5] }
        ],
        lengthMenu: [5, 10, 25],
        pageLength: 10,
        scrollX: true
    });
    
    // Búsqueda personalizada
    document.getElementById('custom-search-button').addEventListener('click', (event) => {
        event.preventDefault(); // Evita el comportamiento predeterminado que recarga la página
        const searchValue = document.getElementById('custom-search').value;
        table.search(searchValue).draw();
    });    
};

(async () => {
    const requiredRoles = ['1'];
    if(!validateSessionAndRole(requiredRoles)) return;

    const searchButton = document.getElementById('custom-search-button');
    const searchInput = document.getElementById('custom-search');
    const clearSearchButton = document.getElementById('clear-search-button');

    searchInput.addEventListener('input', () => {
        if(searchInput.value.trim() === ''){
            clearSearchButton.style.display = 'none';
        }else{
            clearSearchButton.style.display = 'block';
        }
    });

    clearSearchButton.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchButton.style.display = 'none';
        loadTable();
    });

    await loadTable();
})();

//Funcion para cargar empleado por id
const findEmployeeById = async id => {
    await fetch((`${URL}/adm/employee/${id}`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => response.json()).then(response => {
        employee = response.data;
        console.log(employee);
    }).catch(console.log);
}

const saveEmployee = async () => {
    let form = document.getElementById('saveEmployeeForm');

    employee = {
        username: document.getElementById('addUsername').value,
        name: document.getElementById('addName').value,
        lastname: document.getElementById('addLastname').value,
        surname: document.getElementById('addSurname').value,
    };

    try {
        const response = await fetch(`${URL}/adm/employee`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(employee)
        });

        const data = await response.json();

        if (response.ok) {
            // Alerta de éxito
            Swal.fire({
                title: "¡Éxito!",
                text: "El empleado ha sido guardado correctamente.",
                icon: "success",
                showConfirmButton:false,
                timer:2000
            });

            // Limpiar el formulario y recargar la tabla
            employee = {}; // Reiniciar el objeto
            await loadTable();
            form.reset();
        } else {
            // Alerta de error si la respuesta no es correcta
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al guardar el empleado. Intenta nuevamente.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    } catch (error) {
        console.log(error);

        // Alerta de error general
        Swal.fire({
            title: "Error",
            text: "Hubo un error al procesar la solicitud. Intenta nuevamente.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
};

//Funcion para cargar datos en modal de actualizar empleado
document.getElementById('updateEmployeeModal').addEventListener('show.bs.modal', async event => {
    const button = event.relatedTarget;
    const employeeId = button.getAttribute('data-employee-id');
    await findEmployeeById(employeeId);
    console.log(employee);

    document.getElementById('updateUsername').value = employee.username;
    document.getElementById('updateName').value = employee.name;
    document.getElementById('updateLastname').value = employee.lastname;
    document.getElementById('updateSurname').value = employee.surname;
});

//Funcion para cargar datos en modal de cambiar estado de empleado
document.getElementById('changeEmployeeStatusModal').addEventListener('show.bs.modal', async event => {
    const button = event.relatedTarget;
    const employeeId = button.getAttribute('data-employee-id');
    const employeeStatus = button.getAttribute('data-employee-status');

    document.getElementById('ch_id').value = employeeId;
    document.getElementById('ch_status').value = employeeStatus;
});

// Funcion para actualizar empleado
const updateEmployee = async () => {
    let form = document.getElementById('updateEmployeeForm');

    employee = {
        id: employee.id,
        username: document.getElementById('updateUsername').value,
        name: document.getElementById('updateName').value,
        lastname: document.getElementById('updateLastname').value,
        surname: document.getElementById('updateSurname').value,
    };

    // Mostrar confirmación con SweetAlert
    Swal.fire({
        icon: 'question',
        title: '¿Realizar operación?',
        showConfirmButton: true,
        confirmButtonColor:"#0d6efd",
        confirmButtonText:"continuar",
        showCancelButton: true,
        cancelButtonColor:"#d33",
        cancelButtonText: "cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`${URL}/adm/employee`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(employee)
            }).then(response => response.json()).then(async response => {
                console.log(employee);
                console.log(response);
                employee = {};
                await loadTable();
                form.reset();

                // SweetAlert2: Mostrar mensaje de éxito
                Swal.fire({
                    title: "¡Actualización exitosa!",
                    text: "El empleado ha sido actualizado correctamente.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    // Cerrar el modal después de que el usuario haga clic en "Aceptar"
                    const modal = document.getElementById('updateEmployeeModal');
                    const updateModal = bootstrap.Modal.getInstance(modal);
                    updateModal.hide(); // Cerrar modal
                });
            }).catch(error => {
                console.error(error);

                // SweetAlert2: Mostrar mensaje de error
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al actualizar el empleado.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            });
        }
    });
};

// Función para cambiar el estado de empleado con confirmación SweetAlert
const confirmChangeStatusEmployee = (id, status) => {
    Swal.fire({
        title: `¿Estás seguro de ${status ? 'deshabilitar' : 'habilitar'} al empleado?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#d33",
        confirmButtonText: `${status ? 'Deshabilitar' : 'Habilitar'}`,
        cancelButtonText: "Cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, eliminar el cliente
            try {
                const response = await fetch(`${URL}/adm/employee/status`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify({ id: id, status: !status })
                });

                if (response.ok) {
                    // Mostrar confirmación de eliminación
                    Swal.fire({
                        title: `${status ? 'Deshabilitado' : 'Habilitado'}`,
                        text: `El cliente ha sido ${status ? 'deshabilitado' : 'habilitado'} correctamente.`,
                        icon: "success",
                        showConfirmButton: false,  // Esto desactiva el botón "OK"
                        timer: 2000  // Opcional: se cerrará automáticamente después de 2 segundos
                    });
                    // Recargar la tabla de clientes
                    await loadTable();
                } else {
                    Swal.fire(
                        "Error",
                        "Hubo un problema al eliminar el cliente.",
                        "error"
                    );
                }
            } catch (error) {
                console.error('Error al eliminar cliente:', error);
                Swal.fire(
                    "Error",
                    "Hubo un problema al eliminar el cliente.",
                    "error"
                );
            }
        }
    });
};