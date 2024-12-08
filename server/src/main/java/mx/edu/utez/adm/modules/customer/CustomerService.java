package mx.edu.utez.adm.modules.customer;

import mx.edu.utez.adm.modules.customer.DTO.CustomerDTO;
import mx.edu.utez.adm.modules.employee.DTO.EmployeeCustomerDTO;
import mx.edu.utez.adm.modules.employee.Employee;
import mx.edu.utez.adm.modules.employee.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import mx.edu.utez.adm.utils.CustomResponseEntity;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    @Autowired
    private EmployeeRepository employeeRepository;

    //Transformar Employee a EmployeeCustomerDTO
    public EmployeeCustomerDTO transformEmployeeToDTO(Employee e){
        return new EmployeeCustomerDTO(
            e.getId(),
            e.getName(),
            e.getLastname(),
            e.getSurname()
        );
    }

    //Transformar Customer a CustomerDTOForCar
    public CustomerDTO transformCustomerToDTO(Customer c){
        return new CustomerDTO(
                c.getId(),
                c.getName(),
                c.getLastname(),
                c.getSurname(),
                c.getPhone(),
                c.getEmail(),
                c.isStatus(),
                transformEmployeeToDTO(c.getEmployee())
        );
    }

    //Transformar lista de Customer a lista de CustomerDTO
    public List<CustomerDTO> transformCustomersToDTOs(List<Customer> customers){
        List<CustomerDTO> list = new ArrayList<>();
        for(Customer c : customers){
            list.add(transformCustomerToDTO(c));
        }
        return list;
    }

    // Obtener todos los clientes
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll() {
        List<CustomerDTO> list = new ArrayList<>();
        String message = "";
        if(customerRepository.findAll().isEmpty()) {
            message = "Aun no hay registros";
        } else {
            message = "Operación exitosa";
            list = transformCustomersToDTOs(customerRepository.findAll());
        }
        return customResponseEntity.getOkResponse(message, list);
    }

    // Obtener cliente por ID
    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long id) {
        CustomerDTO found = transformCustomerToDTO(customerRepository.findById(id));
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            return customResponseEntity.getOkResponse("Operación exitosa", found);
        }
    }

    //Traer todos los clientes por empleado asignado
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAllByEmployeeId(long employeeId){
        List<CustomerDTO> list = new ArrayList<>();
        String message = "";
        if(employeeRepository.findById(employeeId) == null){
            return customResponseEntity.get404Response();
        }
        if(customerRepository.findAllByEmployeeId(employeeId).isEmpty()) {
            message = "Aun no hay registros";
        } else {
            message = "Operacion exitosa";
            list = transformCustomersToDTOs(customerRepository.findAllByEmployeeId(employeeId));
        }
        return customResponseEntity.getOkResponse(message, list);
    }

    //Traer cliente por empleado y por id
    @Transactional(readOnly = true)
    public ResponseEntity<?> findByIdEmployee(long employeeId, long customerId){
        CustomerDTO found = transformCustomerToDTO(customerRepository.findByIdAndEmployeeId(customerId, employeeId));
        if(employeeRepository.findById(employeeId) == null){
            return customResponseEntity.get404Response();
        }
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            return customResponseEntity.getOkResponse("Operación exitosa", found);
        }
    }

    // Guardar un nuevo cliente
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> save(Customer customer) {
        try {
            customer.setStatus(true);
            customerRepository.save(customer);
            return customResponseEntity.get201Response("Registro exitoso");
        } catch (Exception e) {
            return customResponseEntity.get400Response();
        }
    }

    // Actualizar un cliente existente
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> update(Customer customer) {
        Customer existingCustomer = customerRepository.findById(customer.getId());
        if (existingCustomer == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                customer.setStatus(existingCustomer.isStatus());
                customerRepository.save(customer);
                return customResponseEntity.getOkResponse("Actualización exitosa", null);
            } catch (Exception e) {
                return customResponseEntity.get400Response();
            }
        }
    }

    // Eliminar un cliente por ID
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> deleteById(Customer customer) {
        if (!customerRepository.existsById(customer.getId())) {
            return customResponseEntity.get404Response();
        } else {
            try {
                customerRepository.deleteById(customer.getId());
                return customResponseEntity.getOkResponse("Eliminación exitosa", "null");
            } catch (Exception e) {
                return customResponseEntity.get400Response();
            }
        }
    }

    //Cambiar el estado de un cliente
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> changeStatus(Customer customer){
        Customer found = customerRepository.findById(customer.getId());
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            try{
                found.setStatus(customer.isStatus());
                customerRepository.changeStatus(found.getId(), found.isStatus());
                return customResponseEntity.getOkResponse(
                        "Actualizacion de estado exitosa",
                        null
                );
            }catch (Exception e){
                return customResponseEntity.get400Response();
            }
        }
    }

    //Traer todos los clientes activos
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAllActive(){
        List<CustomerDTO> list = new ArrayList<>();
        String message = "";
        if(customerRepository.findAllActive().isEmpty()) {
            message = "Aun no hay registros";
        } else {
            message = "Operacion exitosa";
            list = transformCustomersToDTOs(customerRepository.findAllActive());
        }
        return customResponseEntity.getOkResponse(message, list);
    }
}

