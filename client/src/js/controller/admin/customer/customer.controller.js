const URL = 'http://localhost:8080';
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const mainContent = document.getElementById('mainContent');

let customerList = []
let customer={}
let employeeList = []
let employee = {}
let customerIdToDelete = null;  // Variable global para almacenar el ID del cliente a eliminar

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

const findAllCustomers = async()=> {
    await fetch(`${URL}/adm/customer`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        customerList = response.data;

    }).catch(console.log);
}

document.getElementById('saveCustomer').addEventListener('click', async () => {
    const customer = {
        name: document.getElementById('customerName').value.trim(),
        lastname: document.getElementById('customerLastName').value.trim(),
        surname: document.getElementById('customerSurName').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        email: document.getElementById('customerEmail').value.trim(),
        employee: { id: document.getElementById('customerEmployee').value }
    };

    // Validación de los campos
    if (validateCustomer(customer)) {
        try {
            
            const response = await fetch(`${URL}/adm/customer`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    "Accept": "application/json"
                },
                body: JSON.stringify(customer),
            });

            if (response.ok) {
                // Alerta de éxito al agregar el cliente
                Swal.fire({
                    title: "¡Éxito!",
                    text: "El cliente ha sido agregado correctamente.",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });

                // Recargar la tabla de clientes
                await loadCustomers();

                // Limpiar el formulario
                document.getElementById('customerForm').reset();

                // Cerrar el modal
                bootstrap.Modal.getInstance(document.getElementById('customerModal')).hide();
            } else {
                // Alerta de error al agregar el cliente
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al agregar el cliente. Intenta nuevamente.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        } catch (error) {
            console.error('Error al agregar cliente:', error);

            // Alerta de error general en la solicitud
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al guardar el cliente.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    } else {
        // Alerta si la validación falla
        Swal.fire({
            title: "¡Advertencia!",
            text: "Por favor, complete todos los campos correctamente.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
});

// Función de validación (simplificada)
function validateCustomer(customer) {
    let isValid = true;

    // Limpiar errores previos
    clearErrors();

    // Validar nombre
    if (!customer.name) {
        showError('customerName', 'Este campo es obligatorio.');
        isValid = false;
    }

    // Validar apellido paterno
    if (!customer.lastname) {
        showError('customerLastName', 'Este campo es obligatorio.');
        isValid = false;
    }

    // Validar apellido materno
    if (!customer.surname) {
        showError('customerSurName', 'Este campo es obligatorio.');
        isValid = false;
    }

    // Validar teléfono
    if (!customer.phone) {
        showError('customerPhone', 'Este campo es obligatorio.');
        isValid = false;
    } else {
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(customer.phone)) {
            showError('customerPhone', 'El teléfono debe ser un número de 10 dígitos.');
            isValid = false;
        }
    }

    // Validar correo electrónico
    if (!customer.email) {
        showError('customerEmail', 'Este campo es obligatorio.');
        isValid = false;
    } else {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(customer.email)) {
            showError('customerEmail', 'Por favor, ingresa un correo electrónico válido.');
            isValid = false;
        }
    }

    // Validar empleado


    return isValid;
}

// Función para mostrar el error en el campo
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('is-invalid');  // Agregar clase de error

    // Mostrar el mensaje de error correspondiente
    const errorMessage = document.getElementById('error' + fieldId.charAt(0).toUpperCase() + fieldId.slice(1));
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';  // Asegurarse de que el mensaje sea visible
}

// Función para limpiar los errores previos
function clearErrors() {
    const fields = document.querySelectorAll('.form-control');
    fields.forEach(field => {
        field.classList.remove('is-invalid');  // Eliminar clase de error
    });

    // Limpiar mensajes de error
    const errorMessages = document.querySelectorAll('.invalid-feedback');
    errorMessages.forEach(msg => {
        msg.textContent = '';  // Limpiar el mensaje
        msg.style.display = 'none';  // Ocultar el mensaje
    });
}




const findAllEmployees = async () => {
    await fetch(`${URL}/adm/employee/active`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => response.json()).then(response => {
        employeeList = response.data;
    }).catch(console.log);
}
const loadSelect = async () => {
    await findAllEmployees(); // Asegúrate de que esta función llena employeeList
    let selectEmployee = document.getElementById('customerEmployee');
    let content = '<option value="" disabled selected>Seleccione un empleado</option>';

    if (employeeList.length === 0) {
        content += '<option disabled>No hay empleados registrados</option>';
    } else {
        employeeList.forEach(employee => {
            content += `<option value="${employee.id}">${employee.name} ${employee.lastname} ${employee.surname}</option>`;
        });
    }
    selectEmployee.innerHTML = content;
};

const loadCustomers = async () => {
    await findAllCustomers();
    let content = '';
    customerList.forEach(customer => {
        content += `<tr>
            <td>${customer.name} ${customer.lastname} ${customer.surname}</td>
            <td>${customer.phone}</td>
            <td>${customer.email}</td>
            <td>${customer.employee.name} ${customer.employee.lastname} ${customer.employee.surname}</td>
            <td>
            ${customer.status ? `<span class="badge-active-status">Activo</span>` : `<span class="badge-inactive-status">Inactivo</span>`}
            </td>
            <td class="text-center">
                <div class="btn-group" role="group" aria-label="Grupo de botones">
                    <button class="btn btn-outline-primary" onclick="loadInfo(${customer.id})" data-bs-target="#updateModal" data-bs-toggle="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-outline-warning" onclick="confirmChangeStatusCustomer(${customer.id},${customer.status})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
                            <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>`;
    });
    
    if($.fn.DataTable.isDataTable('#customer-table')){
        $('#customer-table').DataTable().destroy();
    }

    const tbody = document.getElementById('customer-tbody');
    tbody.innerHTML = content;
    document.getElementById('custom-search').value = '';

    const table = $('#customer-table').DataTable({
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
            { orderable: false, targets: [4,5] }, 
            { searchable: false, targets: [4,5] } 
        ],
        lengthMenu: [5, 10, 25], 
        pageLength: 10,          
        scrollX: true            
    });

document.getElementById('custom-search-button').addEventListener('click', (event) => {
    event.preventDefault(); // Evita recargar la página
    const searchValue = document.getElementById('custom-search').value;
    $('#customer-table').DataTable().search(searchValue).draw();
});
};

(async () => {
    const requiredRoles = ['1'];
    if(!validateSessionAndRole(requiredRoles)) return;

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
        loadCustomers();
    });

    await loadCustomers();
    await loadSelect();
})();

// Función que muestra el SweetAlert2 para confirmar el cambio de estado del cliente -> Se puede implementar en los otros controladores
const confirmChangeStatusCustomer = (id, status) => {
    Swal.fire({
        title: `¿Estás seguro de ${status ? 'deshabilitar' : 'habilitar'} el cliente?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `${status ? 'Deshabilitar' : 'Habilitar'}`,
        cancelButtonText: "Cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, eliminar el cliente
            try {
                const response = await fetch(`${URL}/adm/customer/status`, {
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
                    Swal.fire(
                        `${status ? 'Deshabilitado' : 'Habilitado'}`,
                        `El cliente ha sido ${status ? 'deshabilitado' : 'habilitado'} correctamente.`,
                        "success"
                    );
                    // Recargar la tabla de clientes
                    await loadCustomers();
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

const findById = async id => {
    await fetch(`${URL}/adm/customer/${id}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        let {data} = response;
        customer = JSON.parse(JSON.stringify(data));
    }).catch(error => {
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Fallo de conexión'
            })
        }
    });
}

const loadInfo = async id => {
    await findById(id);
        document.getElementById('u_customerName').value = customer.name || '';
        document.getElementById('u_customerLastName').value = customer.lastname || '';
        document.getElementById('u_customerSurName').value = customer.surname || '';
        document.getElementById('u_customerPhone').value = customer.phone || '';
        document.getElementById('u_customerEmail').value = customer.email || '';
        document.getElementById('u_customerEmployee').value = customer.employee?.id || '';

};

const update = async () => {
    const data = {
        id: customer.id,
        name: document.getElementById('u_customerName').value,
        lastname: document.getElementById('u_customerLastName').value,
        surname: document.getElementById('u_customerSurName').value,
        phone: document.getElementById('u_customerPhone').value,
        email: document.getElementById('u_customerEmail').value,
        employee: {
            id: document.getElementById('u_customerEmployee').value
        }
    };

    Swal.fire({
        icon: 'question',
        title: '¿Realizar operación?',
        showConfirmButton: true,
        showCancelButton: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${URL}/adm/customer`, {
                    method: 'PUT',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) throw new Error(`Error al actualizar: ${response.statusText}`);

                await response.json();

                Swal.fire({
                    icon: 'success',
                    title: 'Operación exitosa',
                    text: 'La actualización se realizó de manera correcta'
                });

                // Cierra el modal
                const modal = document.getElementById('updateModal');
                const updateModal = bootstrap.Modal.getInstance(modal);
                updateModal.hide();

                // Recargar la lista de clientes
                await loadCustomers();
            } catch (error) {
                console.error("Error al actualizar el cliente:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la operación',
                    text: error.message
                });
            }
        }
    });
};
const loadSelectU = async () => {
    await findAllEmployees(); // Asegúrate de que esta función llena employeeList
    let selectEmployee = document.getElementById('u_customerEmployee');
    let content = '<option value="" disabled selected>Seleccione un empleado</option>';

    if (employeeList.length === 0) {
        content += '<option>No hay empleados registrados</option>';
    } else {
        employeeList.forEach(employee => {
            content += `<option value="${employee.id}">${employee.name}</option>`;
        });
    }
    selectEmployee.innerHTML = content;
};
(async () => {
    await loadSelectU();
})();