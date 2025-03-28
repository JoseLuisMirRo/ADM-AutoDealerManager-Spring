const URL = 'http://localhost:8080';
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const mainContent = document.getElementById('mainContent');

// Variables
let serviceList = [];
let service = {};

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

// Obtener todos los servicios
const findAllServices = async () => {
    await fetch(`${URL}/adm/service`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        console.log(response);
        serviceList = response.data;
    }).catch(console.log);
};

// Cargar tabla de servicios
const loadTable = async () => {
    await findAllServices();
    let content = '';
    serviceList.forEach(service => {
        content += `
            <tr>
                <td>${service.name}</td>
                <td>${service.code}</td>
                <td>${service.description}</td>
                <td>${service.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                <td>
                ${service.status ? `<span class="badge-active-status">Activo</span>` : `<span class="badge-inactive-status">Inactivo</span>`}
                </td>
                <td>
                <div class="btn-group" role="group" aria-label="Grupo de botones">
                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#updateServiceModal" data-service-id="${service.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </button>
                            <button type="button" class="btn btn-outline-warning"  onclick="confirmChangeStatusService(${service.id},${service.status})">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
                                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
                                </svg>
                            </button>
                        </div>
                </td>
            </tr>`;
    });
    if ($.fn.DataTable.isDataTable('#service-table')) {
        $('#service-table').DataTable().destroy(); 
    }

    const tbody = document.getElementById('service-tbody');
    tbody.innerHTML = content;
    document.getElementById('custom-search').value = '';

    const table = $('#service-table').DataTable({
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
        $('#service-table').DataTable().search(searchValue).draw();
    });

};

// Buscar servicio por ID
const findServiceById = async id => {
    await fetch((`${URL}/adm/service/${id}`), {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        service = response.data;
        console.log(response);
    }).catch(console.log);
}

const saveService = async () => {
    const form = document.getElementById('addServiceForm');
    const service = {
        name: document.getElementById('serviceName').value,
        code: document.getElementById('serviceCode').value,
        description: document.getElementById('serviceDescription').value,
        price: parseFloat(document.getElementById('servicePrice').value)
    };

    try {
        const response = await fetch(`${URL}/adm/service`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(service)
        });

        const data = await response.json();

        console.log("Respuesta del servidor:", data); // Verificar qué devuelve el servidor

        if (response.ok) {
            // Alerta de éxito al guardar el servicio
            Swal.fire({
                title: "¡Éxito!",
                text: "El servicio ha sido guardado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            });

            // Limpiar el formulario
            form.reset();

            // Verificar si loadTable está siendo llamada correctamente
            console.log("Cargando la tabla...");
            await loadTable();
        } else {
            // Alerta de error si la respuesta no es correcta
            Swal.fire({
                title: "Error",
                text: `Hubo un problema al guardar el servicio: ${data.message || "Intenta nuevamente."}`,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    } catch (error) {
        console.log("Error al procesar la solicitud:", error);

        // Alerta de error general si hay un fallo en la solicitud
        Swal.fire({
            title: "Error",
            text: "Hubo un error al procesar la solicitud. Intenta nuevamente.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
};


document.getElementById('updateServiceModal').addEventListener('show.bs.modal', async event => {
    const button = event.relatedTarget;
    const serviceId = button.getAttribute('data-service-id');
    await findServiceById(serviceId);
    console.log(service);

    document.getElementById('updateServiceCode').value = service.code;
    document.getElementById('updateServiceName').value = service.name;
    document.getElementById('updateServiceDescription').value = service.description;
    document.getElementById('updateServicePrice').value = service.price;
});

// Actualizar un servicio
const updateService = async () => {
    let form = document.getElementById('updateServiceForm');

    service = {
        id: service.id,
        name: document.getElementById('updateServiceName').value,
        code: document.getElementById('updateServiceCode').value,
        description: document.getElementById('updateServiceDescription').value,
        price: parseFloat(document.getElementById('updateServicePrice').value)
    };
     // Mostrar confirmación con SweetAlert
 Swal.fire({
    icon: 'question',
    title: '¿Realizar operación?',
    showConfirmButton: true,
    showCancelButton: true
}).then(async (result) => {
    if (result.isConfirmed) {
        await fetch(`${URL}/adm/service/${service.id}`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(service)
        }).then(response => response.json()).then(async response => {
            console.log(service);
            console.log(response);
            service = {};
            await loadTable();
            form.reset();
        

            // SweetAlert2: Mostrar mensaje de éxito
            Swal.fire({
                title: "¡Actualización exitosa!",
                text: "El empleado ha sido actualizado correctamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => {
                // Cerrar el modal después de que el usuario haga clic en "Aceptar"
                const modal = document.getElementById('updateServiceModal');
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

const confirmChangeStatusService = (id, status) => {
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
                const response = await fetch(`${URL}/adm/service/status`, {
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
// Inicializar la tabla
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
        loadTable();
    });

    await loadTable();
})();
