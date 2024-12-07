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
        return data.data; 
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
        return data.data; 
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



const loadCards = async(filter = 'onSale')=> {
    let filteredCarList = await (filter === 'onSale' ? findOnSaleCars() : findEmployeeClientCars(employeeId));
    filteredCarList.sort((a, b) => a.brand.name.localeCompare(b.brand.name));
    let cardContainer = document.getElementById('cardContainer');
    let content = '';

    if(filteredCarList.length === 0){
        content = `<div class="col-12 text-center mt-5">
                        <h3>No hay autos ${filter === 'onSale' ? 'disponibles' : 'vendidos'}</h3>
                    </div>`;
    } else {
        filteredCarList.forEach(car => {
            content += createCarCard(car); //Agregamos cada tarjeta
        });
    }
    cardContainer.innerHTML = content;
    carList = filteredCarList;
}

const createCarCard = car => {
    return `<div class="col-12 col-md-6 col-lg-3">
                <div class="card shadow">
                    <div class="card-body mb-1">
                        <div class="d-flex justify-content-between">
                            <h4>${car.brand.name}</h4>
                            ${car.onSale ? `<div class="px-2 badge-activeAuto"> Disponible</div>` : `<div class="px-2 badge-soldAuto"> Vendido</div>`}
                        </div>
                        <h4>${car.model}</h4>
                        <div class="row align-items-center">
                            <div class="col text-start m-3 ms-0">
                                <div class="d-flex justify-content-between">
                                    <div class="btn-group " role="group" aria-label="Grupo de botones">
                                        <button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#seeMore" data-car-id="${car.id}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            ${car.onSale ? `
                            <div class="col col-md col-lg text-end">
                                <button class=" btn btn-outline-light rounded-circle" data-bs-toggle="modal" data-bs-target="#saleCarModal" data-car-id="${car.id}"> 
                                    <img src="../../../img/moneda.png" style="height: 43px; width: 43px;">
                                </button>
                                `: ``}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
                `;

};

(async () =>{
    const requiredRoles = ['2'];

    if (!validateSessionAndRole(requiredRoles)) return;

    const availableTab = document.getElementById('available-tab');
    const soldTab = document.getElementById('sold-tab');

    availableTab.addEventListener('click', () => loadCards('onSale'));
    soldTab.addEventListener('click', () => loadCards('sold'));

    await loadCards('onSale');
})()

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


