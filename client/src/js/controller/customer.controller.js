const URL = 'http://localhost:8080';
let customerList = []
let customer={}
let employeeList = []
let employee = {}
let customerIdToDelete = null;  // Variable global para almacenar el ID del cliente a eliminar

const findAllCustomers = async()=> {
    await fetch(`${URL}/adm/customer`, {
        method: 'GET',
        headers: {
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
                    'Content-Type': 'application/json',
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
    await fetch(`${URL}/adm/employee`, {
        method: 'GET',
        headers: {
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
        content += '<option>No hay empleados registrados</option>';
    } else {
        employeeList.forEach(employee => {
            content += `<option value="${employee.id}">${employee.name}</option>`;
        });
    }
    selectEmployee.innerHTML = content;
};
(async () => {
    await loadSelect();
})();

const loadCustomers = async () => {
    await findAllCustomers();
    let tbody = document.getElementById('tableCustomers');
    let content = '';
    customerList.forEach(customer => {
        content += `<tr>
            <td>${customer.name} ${customer.lastname} ${customer.surname}</td>
            <td>${customer.phone}</td>
            <td>${customer.email}</td>
            <td>${customer.employee.name}</td>
            <td class="text-center">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="confirmDeleteCustomer(${customer.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                    </svg></button>
                    <button class="btn btn-outline-primary" onclick="loadInfo(${customer.id})" data-bs-target="#updateModal" data-bs-toggle="modal"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg></button>
                </div>
            </td>
        </tr>`;
    });
    tbody.innerHTML = content;
};

// Función que muestra el SweetAlert2 para confirmar la eliminación
const confirmDeleteCustomer = (id) => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
        cancelButtonText: "Cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, eliminar el cliente
            try {
                const response = await fetch(`${URL}/adm/customer/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Mostrar confirmación de eliminación
                    Swal.fire(
                        "¡Eliminado!",
                        "El cliente ha sido eliminado.",
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
// Cargar los clientes al inicio
(async () => {
    await loadCustomers();
})();

const findById = async id => {
    await fetch(`${URL}/adm/customer/${id}`, {
        method: 'GET',
        headers: {
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
