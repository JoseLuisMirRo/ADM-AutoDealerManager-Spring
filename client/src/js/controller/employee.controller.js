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
                            <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#updateEmployee">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </button>
                            <button type="button" class="btn btn-outline-warning" onclick="changeStatus()" data-bs-toggle="modal" data-bs-target="#changeEmployeeStatusModal">
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

