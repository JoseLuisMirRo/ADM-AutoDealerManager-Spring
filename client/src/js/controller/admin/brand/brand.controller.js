const URL = "http://localhost:8080"
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const mainContent = document.getElementById('mainContent');

let brandList = []
let brand = {}

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

const findAllBrands = async () => {
    await fetch(`${URL}/adm/brand`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => response.json()).then(response => {
        brandList = response.data; 
    }).catch(console.log);
}

const loadTable = async () => {
    await findAllBrands();
    let tbody = document.getElementById('brand-table');
    let content = "";
    brandList.forEach(brand => {
        //No me encanta el numeral pero asi viene el diseño!!!!
        content += `<tr>
             <th scope="row">${brandList.indexOf(brand) + 1}</th> 
            <!--Nombre Marca-->
            <td>${brand.name}</td>
            <td>
                ${brand.status ? '<span class="badge-active-status">Activa</span>' : '<span class="badge-inactive-status">Inactiva</span>'}    
            </td>
            <!--Acciones-->
            <td>
                <div class="btn-group" role="group" aria-label="Grupo de botones">
                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#updateBrandModal" data-brand-id="${brand.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                    </svg>
                </button>
                <button type="button" class="btn btn-outline-warning" onclick="confirmChangeStatusBrand(${brand.id},${brand.status})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
                    </svg>
                </button>
                </div>        
            </td>
            </tr>`
    });
    tbody.innerHTML = content;
}

(async () => {
    const requiredRoles = ['1'];

    if (!validateSessionAndRole(requiredRoles)) return;

    await loadTable();
})();

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
        await loadTable();
        form.reset();
    }).catch(console.log);
};

//Funcion para cargar marca por id
const findBrandById = async id => {
    await fetch((`${URL}/adm/brand/${id}`), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => response.json()).then(response => {
        brand = response.data;
    }).catch(console.log);
}

//Funcion para cargar datos en el modal de actualizar marca 
document.getElementById('updateBrandModal').addEventListener('show.bs.modal', async event => {
    const button = event.relatedTarget;
    const employeeId = button.getAttribute('data-brand-id');
    await findBrandById(employeeId);
    document.getElementById('idBrand').value = brand.id;
    document.getElementById('updateName').value = brand.name;
});

//Funcion para actualizar marca
const updateBrand = async () => {
    let form = document.getElementById('updateBrandForm');
    brand = {
        id: document.getElementById('idBrand').value,
        name: document.getElementById('updateName').value
    };

    await fetch(`${URL}/adm/brand`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(brand)
    }).then(response => response.json()).then(async response => {
        brand = {};
        Swal.fire({
            icon: 'success',
            title: 'Marca actualizada correctamente',
            showConfirmButton: false,
        });
        await loadTable();
        form.reset();
    }).catch(console.log);
};

//Funcion para cambiar estado de marca
const confirmChangeStatusBrand = async (id, status) => {
    Swal.fire({
        title: `¿Estás seguro de ${status ? 'desactivar' : 'activar'} la marca?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `${status ? 'Deshabilitar' : 'Habilitar'}`,
        cancelButtonText: "Cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try{
                const response = await fetch(`${URL}/adm/brand/status`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                        status: !status
                    })
                });

                if(response.ok){
                    Swal.fire(
                        `${status ? 'Deshabilitada' : 'Habilitada'}`,
                        `La marca ha sido ${status ? 'deshabilitada' : 'habilitada'} correctamente`,
                        'success'
                    );

                    await loadTable();
                }else{
                    Swal.fire(
                        'Error',
                        'Ocurrió un error al cambiar el estado de la marca',
                        'error'
                    );
                }
            }catch(error){
                console.log(error);
                Swal.fire(
                    'Error',
                    'Ocurrió un error al cambiar el estado de la marca',
                    'error'
                );
            }
        }
    });
}
