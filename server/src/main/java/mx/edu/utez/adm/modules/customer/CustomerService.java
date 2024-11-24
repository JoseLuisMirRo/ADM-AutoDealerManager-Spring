package mx.edu.utez.adm.modules.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import mx.edu.utez.adm.utils.CustomResponseEntity;

import java.sql.SQLException;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    // Obtener todos los clientes
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll() {
        List<Customer> customers = customerRepository.findAll();
        if (customers.isEmpty()) {
            return customResponseEntity.getOkResponse("Aún no hay registros", "OK");
        } else {
            return customResponseEntity.getOkResponse("Operación exitosa", "OK");
        }
    }

    // Obtener cliente por ID
    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long id) {
        Customer customer = customerRepository.findById(id);
        if (customer == null) {
            return customResponseEntity.get404Response();
        } else {
            return customResponseEntity.getOkResponse("Operación exitosa", "OK");
        }
    }

    // Guardar un nuevo cliente
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> save(Customer customer) {
        try {
            customerRepository.save(customer);
            return customResponseEntity.getOkResponse("Registro exitoso", "OK");
        } catch (Exception e) {
            e.printStackTrace();
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
                existingCustomer.setName(customer.getName());
                existingCustomer.setSurname(customer.getSurname());
                existingCustomer.setLastname(customer.getLastname());
                existingCustomer.setPhone(customer.getPhone());
                existingCustomer.setEmail(customer.getEmail());
                existingCustomer.setEmployee(customer.getEmployee());
                existingCustomer.setCars(customer.getCars());

                customerRepository.save(existingCustomer);
                return customResponseEntity.getOkResponse("Actualización exitosa", "OK");
            } catch (Exception e) {
                e.printStackTrace();
                return customResponseEntity.get400Response();
            }
        }
    }

    // Eliminar un cliente por ID
    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> deleteById(long id) {
        if (!customerRepository.existsById(id)) {
            return customResponseEntity.get404Response();
        } else {
            try {
                customerRepository.deleteById(id);
                return customResponseEntity.getOkResponse("Eliminación exitosa", "OK");
            } catch (Exception e) {
                e.printStackTrace();
                return customResponseEntity.get400Response();
            }
        }
    }
}

