const URL = 'http://localhost:8080'

let employeeList = []
let employee = {}

const findAllEmployees = async () => {
    await fetch(`${URL}/employees`), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(response => response.json()).then(response => {
        employeeList = response.data;
    }).catch(console.log);
}

