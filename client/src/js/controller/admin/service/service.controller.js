const URL = 'http://localhost:8080';

let serviceList = [];
let service = {};

// Obtener todos los servicios
const findAllServices = async () => {
    await fetch(`${URL}/adm/service`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => response.json()).then(response => {
        serviceList = response.data || [];
    }).catch(console.error);
};

// Cargar tabla de servicios
const loadTable = async () => {
    await findAllServices();
    const tbody = document.getElementById('service-table');
    let content = '';
    serviceList.forEach(service => {
        content += `
            <tr>
                <td>${service.name}</td>
                <td>${service.description}</td>
                <td>${service.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                <td>
                    <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#updateServiceModal" data-service-id="${service.id}">
                        Editar
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = content;
};

// Buscar servicio por ID
const findServiceById = async (id) => {
    await fetch(`${URL}/adm/service/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => response.json()).then(response => {
        service = response.data;
    }).catch(console.error);
};

// Guardar un nuevo servicio
const saveService = async () => {
    const form = document.getElementById('saveServiceForm');
    service = {
        name: document.getElementById('addServiceName').value,
        description: document.getElementById('addServiceDescription').value,
        price: parseFloat(document.getElementById('addServicePrice').value)
    };

    await fetch(`${URL}/adm/service`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(service)
    }).then(async () => {
        service = {};
        form.reset();
        await loadTable();
        document.querySelector('#saveServiceModal .btn-close').click();
    }).catch(console.error);
};

// Actualizar un servicio
const updateService = async () => {
    const form = document.getElementById('updateServiceForm');
    service = {
        id: service.id,
        name: document.getElementById('updateServiceName').value,
        description: document.getElementById('updateServiceDescription').value,
        price: parseFloat(document.getElementById('updateServicePrice').value)
    };

    await fetch(`${URL}/adm/service`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(service)
    }).then(async () => {
        service = {};
        form.reset();
        await loadTable();
        document.querySelector('#updateServiceModal .btn-close').click();
    }).catch(console.error);
};

// Configuración de modales
document.getElementById('updateServiceModal').addEventListener('show.bs.modal', async (event) => {
    const button = event.relatedTarget;
    const serviceId = button.getAttribute('data-service-id');
    await findServiceById(serviceId);

    document.getElementById('updateServiceName').value = service.name;
    document.getElementById('updateServiceDescription').value = service.description;
    document.getElementById('updateServicePrice').value = service.price;
});

// Inicializar
(async () => {
    await loadTable();
})();
