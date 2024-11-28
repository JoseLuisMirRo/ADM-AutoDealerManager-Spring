const URL = 'http://localhost:8080';
let serviceList = [];

// Obtener servicios
const fetchServices = async () => {
    try {
        const response = await fetch(`${URL}/adm/service`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        const data = await response.json();
        serviceList = data.data || [];
        console.log(serviceList)
    } catch (error) {
        console.error('Error al obtener servicios:', error);
    }
};

// Cargar servicios en pantalla
const loadServices = async () => {
    await fetchServices();
    const servicesContainer = document.getElementById('servicesContainer');
    let content = '';
    serviceList.forEach(service => {
        content += `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card shadow">
                    <div class="card-body">
                        <h5>${service.name}</h5>
                        <p>${service.description}</p>
                        <p><strong>Precio:</strong> ${service.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                    </div>
                </div>
            </div>
        `;
    });
    servicesContainer.innerHTML = content;
};

// Buscar servicios
document.getElementById('searchButton').addEventListener('click', () => {
    const filter = document.getElementById('searchFilter').value.toLowerCase();
    const filteredServices = serviceList.filter(service =>
        service.name.toLowerCase().includes(filter) ||
        service.description.toLowerCase().includes(filter)
    );
    renderServices(filteredServices);
});

// Renderizar servicios filtrados
const renderServices = (services) => {
    const servicesContainer = document.getElementById('servicesContainer');
    let content = '';
    services.forEach(service => {
        content += `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card shadow">
                    <div class="card-body">
                        <h5>${service.name}</h5>
                        <p>${service.description}</p>
                        <p><strong>Precio:</strong> ${service.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                    </div>
                </div>
            </div>
        `;
    });
    servicesContainer.innerHTML = content;
};

// Agregar nuevo servicio
document.getElementById('addServiceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newService = {
        name: document.getElementById('serviceName').value,
        description: document.getElementById('serviceDescription').value,
        price: parseFloat(document.getElementById('servicePrice').value)
    };

    try {
        const response = await fetch(`${URL}/adm/service`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newService)
        });

        if (response.ok) {
            document.getElementById('addServiceForm').reset();
            document.querySelector('#addServiceModal .btn-close').click();
            loadServices();
        } else {
            console.error('Error al agregar servicio');
        }
    } catch (error) {
        console.error('Error al guardar el servicio:', error);
    }
});

// Inicializar
(async () => {
    await loadServices();
})();