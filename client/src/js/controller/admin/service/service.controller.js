const URL = 'http://localhost:8080';

// Variables
let serviceList = [];
let service = {};

// Obtener todos los servicios
const findAllServices = async () => {
    await fetch(`${URL}/adm/service`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        serviceList = response.data;
    })
    .catch(console.log);
};

// Cargar tabla de servicios
const loadTable = async () => {
    await findAllServices();

    const tbody = document.getElementById('tbody');
    let content = '';
    serviceList.forEach((item, index) => {
        content += `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                <td class="text-center">
                    <button class="btn btn-outline-danger" data-bs-target="#deleteModal" onclick="findServiceById(${item.id})" data-bs-toggle="modal">Eliminar</button>
                    <button class="btn btn-outline-primary" data-bs-target="#updateModal" onclick="loadService(${item.id})" data-bs-toggle="modal">Editar</button>
                </td>
            </tr>`;
    });
    tbody.innerHTML = content;
};

// Buscar servicio por ID
const findServiceById = async id => {
    await fetch(`${URL}/adm/service/${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        service = response.data;
    })
    .catch(console.log);
};

// Guardar un nuevo servicio
const saveService = async () => {
    const form = document.getElementById('addServiceForm');
    service = {
        code: document.getElementById('serviceCode').value,
        name: document.getElementById('serviceName').value,
        description: document.getElementById('serviceDescription').value,
        price: parseFloat(document.getElementById('servicePrice').value)
    };

    await fetch(`${URL}/adm/service`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(service)
    })
    .then(response => response.json())
    .then(async response => {
        console.log(response);
        service = {};
        await loadTable();
        form.reset();
    })
    .catch(console.log);
};


// Actualizar un servicio
const updateService = async () => {
    const form = document.getElementById('updateServiceForm');
    const updated = {
        id: service.id,
        code: document.getElementById('updateServiceCode').value,
        name: document.getElementById('updateServiceName').value,
        description: document.getElementById('updateServiceDescription').value,
        price: parseFloat(document.getElementById('updateServicePrice').value)
    };

    await fetch(`${URL}/adm/service/${service.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updated)
    })
    .then(response => response.json())
    .then(async response => {
        console.log(response);
        service = {};
        await loadTable();
        form.reset();
    })
    .catch(console.log);
};


// Eliminar un servicio
const deleteService = async () => {
    await fetch(`${URL}/adm/service/${service.id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(response => response.json())
    .then(async response => {
        console.log(response);
        service = {};
        await loadTable();
    })
    .catch(console.log);
};

// Inicializar la tabla
(async () => {
    await loadTable();
})();
