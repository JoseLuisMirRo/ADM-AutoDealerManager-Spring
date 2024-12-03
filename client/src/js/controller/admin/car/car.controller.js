const URL = 'http://localhost:8080'
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
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

const findAllCars = async()=> {
    await fetch(`${URL}/adm/car`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        carList = response.data;
    }).catch(console.log);
}

const loadCards = async()=> {
    await findAllCars();
    let cardContainer = document.getElementById('cardContainer');
    let content = '';
    carList.forEach(car => {
        content += createCarCard(car); //Agregamos cada tarjeta
        cardContainer.innerHTML = content;
    });

}

const createCarCard = car => {
    return `
            <div class="col-12 col-md-6 col-lg-3">
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
                                        <button type="button" class="btn boton-verMas" data-bs-toggle="modal" data-bs-target="#seeMore" data-car-id="${car.id}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                            </svg>
                                        </button>
                                        <button type="button" class="btn boton-editar" data-bs-toggle="modal" data-bs-target="#updateCar">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                            </svg>
                                        </button>
                                        <button type="button" class="btn boton-eliminar" onclick="confirmDeleteCar(${car.id})">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
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
    const requiredRoles = ['1'];

    if (!validateSessionAndRole(requiredRoles)) return;

    await loadCards();
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

//Funcion para cargar clientes para registrar nuevo auto
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

//Funcion para cargar marcas para registrar nuevo auto 
const findAllBrands = async()=> {
    await fetch(`${URL}/adm/brand`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        brandList = response.data;
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

//Funcion para cargar los clientes para los select
const loadCustomers = async()=> {
    await findAllCustomers();

    let customerSelect = document.getElementById('addCustomer');
    let content = '<option value="" disabled selected>Seleccione un cliente</option>';

    if(customerList.length === 0){
        content += '<opton>No hay clientes registrados</opton>'
    }else{
        customerList.forEach(item => {
            content += `<option value=${item.id}>${item.name} ${item.lastname} ${item.surname}</option>`
        });
    }
    customerSelect.innerHTML = content;

}

//Funcion para cargar las marcas para los select
const loadBrands = async (selectId) => {
    await findAllBrands();
    console.log(selectId);
    let brandSelect = document.getElementById(selectId);
    let content = '<option value="" disabled selected>Seleccione una marca</option>';

    if(brandList.length === 0){
        content += '<option>No hay marcas registradas</option>'
    }else{
        brandList.forEach(item => {
            content += `<option value=${item.id}>${item.name}</option>`
        });
    }
    brandSelect.innerHTML = content;

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


const saveCar = async()=>{
    let form = document.getElementById('saveCarForm')

    car = {
        model: document.getElementById('addModel').value,
        color: document.getElementById('addColor').value,
        basePrice: document.getElementById('addPrice').value,
        brand:{
            id: document.getElementById('addBrand').value
        }
    };

    await fetch(`${URL}/adm/car`,{
        method:"POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(car)
    }).then(response => response.json()).then(async response=>{
        console.log(car);
        console.log(response);
        car={};
        await loadCards();
        form.reset();
    }).catch(console.log);
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
    const carId = button.getAttribute('data-car-id');

    await loadBrands('updateBrand');

    car = carList.find(c => c.id == carId);

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


