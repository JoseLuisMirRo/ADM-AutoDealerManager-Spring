const URL = 'http://localhost:8080'

let carList = {};

const findAllCars = async()=> {
    await fetch(`${URL}/adm/car`, {
        method: 'GET',
        headers: {
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
                            <div class="card-body">
                                <div class="row">
                                    <div class="col"><h3>${car.brand.name} ${car.model}</h3></div>
                                    
                                    <div class="col text-end mt-1 ms-auto">
                                        <div class="btn-group" role="group" aria-label="Grupo de botones">
                                            <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#seeMore" data-car-id="${car.id}">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                                </svg>
                                            </button>
                                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#updateCar">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                                </svg>
                                            </button>
                                            <button type="button" class="btn btn-outline-warning" onclick="changeStatus()" data-bs-toggle="modal" data-bs-target="#changeCarStatusModal">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
                                                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>    
                                <hr>
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <h5 style="color:#3d728f">Propietario: ${car.customer.name} ${car.customer.lastname} ${car.customer.surname}</h5>
                                    </div>
                                </div>
                                
                                
                                <div class="row mb-2">
                                    <div class="col-6">
                                        <label><strong>Precio: </strong><span>${car.price.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}</span></label>
                                    </div>
                                    <div class="col-6">
                                    <label><strong>Color: </strong><span>${car.color}</span></label>
                                    </div>
                                </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                `;
};

(async () =>{
    await loadCards();
})()

document.getElementById('seeMore').addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const carId = button.getAttribute('data-car-id');

    const car = carList.find(c => c.id == carId);
    console.log
    if(car) {
        document.getElementById("carBrand").value = car.brand.name;
        document.getElementById("carModel").value = car.model;
        document.getElementById("carPrice").value = car.price.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
        document.getElementById("carColor").value = car.color;
        document.getElementById("carDate").value = car.registerDate;
        document.getElementById("clientName").value = `${car.customer.name} ${car.customer.lastname} ${car.customer.surname}`

        const services = car.services && car.services.length > 0 
            ? car.services.map(service => service.name).join(", ")
            : "No hay servicios seleccionados";
        document.getElementById("carServices").value = services;
    }
});

