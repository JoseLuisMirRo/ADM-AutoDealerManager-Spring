const URL = 'http://localhost:8080'
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const employeeId = localStorage.getItem('employeeId');
const mainContent = document.getElementById('mainContent');

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

let carList = [];
let brandList = [];
let car = {};

const findOnSaleCars = async () => {
    try {
        const response = await fetch(`${URL}/adm/car/onsale`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        const data = await response.json();
        return data.data || []; 
    } catch (error) {
        console.error("Error en findOnSaleCars:", error);
        throw error; 
    }
};

const findEmployeeClientCars = async (employeeId) => {
    try {
        const response = await fetch(`${URL}/adm/car/employee/${employeeId}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        const data = await response.json();
        return data.data || []; 
    } catch (error) {
        console.error("Error en findEmployeeClientCars:", error);
        throw error; 
    }
};


const findAllCars = async (employeeId) => {
    try {
        const [onSaleCars, employeeClientCars] = await Promise.all([
            findOnSaleCars(),
            findEmployeeClientCars(employeeId)
        ]);

        carList = [...onSaleCars, ...employeeClientCars];
        console.log("Car List:", carList);
        return carList;
    } catch (error) {
        console.error("Error al cargar autos:", error);
        throw error;
    }
};



const loadCards = async (filter = 'onSale', searchTerm = '') => {
    let cardContainer = document.getElementById('cardContainer');
    let content = '';

    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.display = 'none';

    const filteredCarList = await (filter === 'onSale' ? findOnSaleCars() : findEmployeeClientCars(employeeId));

    const finalCarList = filteredCarList.filter(car => {
        if (filter === 'onSale') {
            return car.brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.model.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
            return car.customer && car.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    if(finalCarList.length === 0){
        content = `<div class="col-12 text-center mt-5">
                        <h3>No hay autos ${filter === 'onSale' ? 'disponibles' : 'vendidos'}</h3>
                    </div>`;
    } else {
        finalCarList.forEach(car => {
            content += createCarCard(car); 
        });
    }
    cardContainer.innerHTML = content;
    carList = finalCarList;
}

const createCarCard = car => {
    return `
     <div class="col-12 col-md-6 col-lg-3">
            <div class="card shadow">
                <div class="card-body mb-1">
                    <div class="d-flex justify-content-between">
                        <h4>${car.brand.name}</h4>
                        ${car.onSale ? `<div class="px-2 badge-activeAuto"> Disponible</div>` : `<div class="px-2 badge-soldAuto"> Vendido</div> `}
                    </div>
                    <div class="d-flex justify-content-between">
                    <h4>${car.model}</h4>
                    ${!car.onSale ? `<span class="badge-owner"><small>Propietario: ${car.customer.name} ${car.customer.surname} ${car.customer.lastname}</small></span>` : ``}	
                    </div>
                    <div class="row align-items-center">
                        <div class="col text-start m-3 ms-0">
                            <div class="d-flex justify-content-between">
                                <div class="btn-group" role="group" aria-label="Grupo de botones">
                                    <!-- Botón Ver Más o Alternativa -->
                                    ${car.onSale ? `
                                        <button type="button" class="btn" data-bs-toggle="modal" style="background-color: #3d728f; color: white ;" data-bs-target="#seeMore" data-car-id="${car.id}">
                                            Información del Auto
                                        </button>` 
                                        : `
                                        <button type="button" class="btn" style="background-color: #3d728f; color: white ;" data-bs-toggle="modal" data-bs-target="#seeMore" data-car-id="${car.id}">
                                            Informacion De Venta
                                        </button>`}
                                </div>
                            </div>
                        </div>
                        <!-- Botón Vender (Visible siempre) -->
                        ${car.onSale ? `
                        <div class="col col-md col-lg text-end">
                            <button class="btn btn-outline-light rounded-circle" data-bs-toggle="modal" data-bs-target="#saleCarModal" data-car-id="${car.id}"> 
                                <img src="../../../img/moneda.png" style="height: 43px; width: 43px;">
                            </button>
                        </div>` : ``}
                    </div>
                </div>
            </div>
        </div>
    `

};

(async () =>{
    const requiredRoles = ['2'];

    if (!validateSessionAndRole(requiredRoles)) return;

    const availableTab = document.getElementById('available-tab');
    const soldTab = document.getElementById('sold-tab');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clearSearch = document.getElementById('clearSearch');

    let currentFilter = 'onSale';
    searchInput.placeholder="Buscar por marca o modelo";

    // Manejadores de eventos para el filtro
    searchInput.addEventListener('input', () => {
        clearSearch.style.display = searchInput.value.trim() ? 'block' : 'none';
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.style.display = 'none';
        loadCards(currentFilter, '');
    });

    availableTab.addEventListener('click', () => {
        currentFilter = 'onSale';
        searchInput.value = '';
        searchInput.placeholder="Buscar por marca o modelo";
        loadCards(currentFilter, '');
    });

    soldTab.addEventListener('click', () => {
        currentFilter = 'sold';
        searchInput.value = '';
        searchInput.placeholder="Buscar por nombre de cliente";
        loadCards(currentFilter, '');
    });

    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        loadCards(currentFilter, searchInput.value);
    });

    await loadCards('onSale');
})();

//Funcion para cargar datos en boton de ver mas 
document.getElementById('seeMore').addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const carId = button.getAttribute('data-car-id');

    const car = carList.find(c => c.id == carId);

    if(car) {
        document.getElementById("carBrand").value = car.brand.name;
        document.getElementById("carModel").value = car.model;
        document.getElementById("carPrice").value = car.basePrice.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        document.getElementById("carColor").value = car.color;
        document.getElementById("carDate").value = car.registerDate;

        if(!car.onSale){
            document.getElementById("clientName").parentElement.style.display = "block";
            document.getElementById("carServices").parentElement.style.display = "block";
            document.getElementById("totalPriceField").parentElement.style.display = "block";
            document.getElementById("saleHeader").style.display = "block";
            document.getElementById("saleDate").parentElement.style.display = "block";

            document.getElementById("clientName").value = `${car.customer.name} ${car.customer.lastname} ${car.customer.surname}`;
            const services = car.services && car.services.length > 0 
                ? car.services.map(service => service.name).join(", ")
                : "No hay servicios seleccionados";
            document.getElementById("carServices").value = services;
            document.getElementById("totalPriceField").value = car.totalPrice.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
            document.getElementById("saleDate").value = car.saleDate;
        }else{
            document.getElementById("clientName").parentElement.style.display = "none";
            document.getElementById("carServices").parentElement.style.display = "none";
            document.getElementById("totalPriceField").parentElement.style.display = "none";
            document.getElementById("saleHeader").style.display = "none";
            document.getElementById("saleDate").parentElement.style.display = "none";
        }
    }
});

const findAllEmployeeCustomers = async()=> {
    await fetch(`${URL}/adm/customer/employee/${employeeId}`, {
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

//Funcion para cargar servicios para registar nuevo auto 
const findAllServices = async()=> {
    await fetch([`${URL}/adm/service`], {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        serviceList = response.data;
    }).catch(console.log);
}

//Funcion para cargar los servicios para los select
const loadServices = async()=> {
    await findAllServices();
    let serviceSelect = document.getElementById('addServices');
    let content = '<option value="" disabled selected>Seleccione un servicio</option> <option value="">Ninguno</option>';
    if(serviceList.length === 0){
        content += '<option>No hay servicios registrados</option>'
    }else{
        serviceList.forEach(item => {
            content += `<option value=${item.id} data-price=${item.price}>${item.name} | $${item.price}</option>`
        });
    }
    serviceSelect.innerHTML = content;
}

//Funcion para cargar los clientes para los select
const loadCustomers = async()=> {
    await findAllEmployeeCustomers();

    let customerSelect = document.getElementById('addCustomer');
    let content = '<option value="" disabled selected>Seleccione un cliente</option>';

    if(customerList.length === 0){
        content += '<opton>No hay clientes asignados a este empleado</opton>'
    }else{
        customerList.forEach(item => {
            content += `<option value=${item.id}>${item.name} ${item.lastname} ${item.surname}</option>`
        });
    }
    customerSelect.innerHTML = content;

}



//Funcion para cargar datos en modal de venta
document.getElementById('saleCarModal').addEventListener('show.bs.modal', event => {
    loadCustomers();
    loadServices();
    
    const button = event.relatedTarget;
    const carId = button.getAttribute('data-car-id');
    document.getElementById('saleCarId').value = carId;

    car = carList.find(c => c.id == carId);

    if(car){
        const basePrice = car.basePrice;
        document.getElementById('salePrice').value = basePrice.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        const totalPriceField = document.getElementById('totalPriceFieldAdd');
        totalPriceField.value = basePrice.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

        const servicesSelect = document.getElementById('addServices');
        servicesSelect.addEventListener('change', () => {
            updateTotalPrice(basePrice, servicesSelect, totalPriceField);
        });

        if(car.services && car.services.length > 0){
            const services = car.services.map(service => service.name).join(", ");
            document.getElementById('saleCarServices').value = services;

            const initialTotalPrice = car.services.reduce((total, service) => total + service.price, basePrice);
            totalPriceField.value = initialTotalPrice.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        }
    }
});

const updateTotalPrice = (basePrice, servicesSelect, totalPriceField) => {
    let totalPrice = basePrice;

    //Sumar el precio de los servicios seleccionados
    Array.from(servicesSelect.selectedOptions).forEach(option => {
        const servicePrice = parseFloat(option.getAttribute('data-price'));
        if(!isNaN(servicePrice)){
            totalPrice += servicePrice;
        }
    });

    totalPriceField.value = totalPrice.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

const sellCar = async()=>{
    let form = document.getElementById('saleCarForm');
    const selectedServices = Array.from(document.querySelectorAll('#addServices option:checked'))
                                .map(option => option.value);

    car = {
        id: document.getElementById('saleCarId').value,
        customer: {
            id: document.getElementById('addCustomer').value
        },
        services: selectedServices.map(serviceId => ({id: parseInt(serviceId)})),
        totalPrice: parseFloat(document.getElementById('totalPriceFieldAdd').value.replace(/[^0-9.-]+/g,""))
    };

    console.log(car);
    await fetch(`${URL}/adm/car/sell`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(car)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        car = {};
        await loadCards();
    }).catch(console.log);
}

//Funcion para cargar los datos en el modal de actualizacion
document.getElementById('updateCar').addEventListener('show.bs.modal', async event => {
    const button = event.relatedTarget;
    console.log("modal actualizar")
    const carId = button.getAttribute('data-car-id');

    console.log(carId);
    await loadBrands('updateBrand');

    car = carList.find(c => c.id == carId);
    console.log(car);

    if(car){
        document.getElementById('updateId').value = car.id;
        document.getElementById('updateBrand').value = car.brand.id;
        document.getElementById('updateModel').value = car.model;
        document.getElementById('updatePrice').value = car.basePrice;
        document.getElementById('updateColor').value = car.color;
    }
});

//Funcion para actualizar un auto
const updateCar = async()=>{
    let form = document.getElementById('updateCarForm');

    car = {
        id: document.getElementById('updateId').value,
        model: document.getElementById('updateModel').value,
        color: document.getElementById('updateColor').value,
        basePrice: document.getElementById('updatePrice').value,
        brand:{
            id: document.getElementById('updateBrand').value
        }
    };
    await fetch(`${URL}/adm/car`, {
        method: 'PUT',
        headers: {
            "authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(car)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        car = {};
        await loadCards();
        form.reset();
    }).catch(console.log);
}

//Funcion sweetalert para eliminar auto 
const confirmDeleteCar = id => {
    Swal.fire({
        title: '¿Estás seguro de eliminar este auto?',
        text: "¡Esta acción no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '¡Sí, eliminar!',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try{
                const response = await fetch(`${URL}/adm/car`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({id: id})
                });

                if(response.ok){
                    Swal.fire(
                        '¡Eliminado!',
                        'El auto ha sido eliminado.',
                        'success'
                    );
                    await loadCards();
                } else  if (response.status === 405) {
                    Swal.fire(
                        '¡Error!',
                        'No se puede eliminar el auto porque está vendido.',
                        'error'
                    );
                } else {
                    Swal.fire(
                        '¡Error!',
                        'Ocurrió un error al eliminar el auto.',
                        'error'
                    );
                }
            }catch{
                Swal.fire(
                    '¡Error!',
                    'Ocurrió un error al eliminar el auto.',
                    'error'
                );
            }
        }
    });
}

//Funcion para guardar marca 
const saveBrand = async () => {
    let form = document.getElementById('saveBrandForm');
    brand = {
        name: document.getElementById('nameBrand').value
    };

    await fetch(`${URL}/adm/brand`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(brand)
    }).then(response => response.json()).then(async response => {
        brand = {};
        const addCarModal = new bootstrap.Modal(document.getElementById('addCar'));
        addCarModal.show();    
        await loadBrands('addBrand').then(() => {
            document.getElementById('addBrand').value = response.data.id;
        });
        form.reset();
    }).catch(console.log);
};


