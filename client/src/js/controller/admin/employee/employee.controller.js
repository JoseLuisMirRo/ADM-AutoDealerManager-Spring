const URL = 'http://localhost:8080'

let employeeList = []
let employee = {}

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

const loadTable = async () => {
    await findAllEmployees();
    let tbody = document.getElementById('employee-table');
    let content = '';
    employeeList.forEach(employee => {
        content += `<tr>
            <td>${employee.username}</td>
            <td>${employee.name}</td>
            <td>${employee.lastname}</td>
            <td>${employee.surname}</td>
            <td>
            ${employee.status ? `<span class="badge bg-success">Activo</span>` : `<span class="badge bg-danger">Inactivo</span>`}
            </td>
            <td>
                <div class="btn-group" role="group" aria-label="Grupo de botones">
                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#updateEmployeeModal" data-employee-id="${employee.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </button>
                            <button type="button" class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#changeEmployeeStatusModal" data-employee-id="${employee.id}" data-employee-status="${employee.status}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
                                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
                                </svg>
                            </button>
                        </div>
            </td>
        </tr>`
        tbody.innerHTML = content;
    });
};
(async () => {
    await loadTable();
})();

//Funcion para cargar empleado por id
const findEmployeeById = async id => {
    await fetch((`${URL}/adm/employee/${id}`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => response.json()).then(response => {
        employee = response.data;
        console.log(employee);
    }).catch(console.log);
}

//Funcion para guardar empleado 
const saveEmployee = async () => {
    let form = document.getElementById('saveEmployeeForm');

    employee = {
        username: document.getElementById('addUsername').value,
        name: document.getElementById('addName').value,
        lastname: document.getElementById('addLastname').value,
        surname: document.getElementById('addSurname').value,
    };

    await fetch(`${URL}/adm/employee`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(employee)
    }).then(response => response.json()).then(async response => {
        console.log(employee);
        console.log(response);
        employee={};
        await loadTable();
        form.reset();
    }).catch(console.log);
};

//Funcion para cargar datos en modal de actualizar empleado
document.getElementById('updateEmployeeModal').addEventListener('show.bs.modal', async event => {
    const button = event.relatedTarget;
    const employeeId = button.getAttribute('data-employee-id');
    await findEmployeeById(employeeId);
    console.log(employee);

    document.getElementById('updateUsername').value = employee.username;
    document.getElementById('updateName').value = employee.name;
    document.getElementById('updateLastname').value = employee.lastname;
    document.getElementById('updateSurname').value = employee.surname;
});

//Funcion para cargar datos en modal de cambiar estado de empleado
document.getElementById('changeEmployeeStatusModal').addEventListener('show.bs.modal', async event => {
    const button = event.relatedTarget;
    const employeeId = button.getAttribute('data-employee-id');
    const employeeStatus = button.getAttribute('data-employee-status');

    document.getElementById('ch_id').value = employeeId;
    document.getElementById('ch_status').value = employeeStatus;
});

//Funcion para actualizar empleado
const updateEmployee = async () => {
    let form = document.getElementById('updateEmployeeForm');

    employee = {
        id: employee.id,
        username: document.getElementById('updateUsername').value,
        name: document.getElementById('updateName').value,
        lastname: document.getElementById('updateLastname').value,
        surname: document.getElementById('updateSurname').value,
    };

    await fetch(`${URL}/adm/employee`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(employee)
    }).then(response => response.json()).then(async response => {
        console.log(employee);
        console.log(response);
        employee={};
        await loadTable();
        form.reset();
    }).catch(console.log);
};

//Funcion para cambiar estado de empleado
const changeEmployeeStatus = async () => {
    let form = document.getElementById('changeEmployeeStatusForm');
    let updateStatus = document.getElementById('ch_status').value == 'true' ? false : true;

    employee = {
        id: document.getElementById('ch_id').value,
        status: updateStatus
    };

    await fetch(`${URL}/adm/employee/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(employee)
    }).then(response => response.json()).then(async response => {
        console.log(employee);
        console.log(response);
        employee={};
        await loadTable();
        form.reset();
    }).catch(console.log);
}



