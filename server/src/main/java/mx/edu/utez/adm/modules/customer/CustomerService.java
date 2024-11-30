package mx.edu.utez.adm.modules.customer;

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

    // Obtener todos los clientes
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll() {
        List<Customer> list = new ArrayList<>();
        String message = "";
        if(customerRepository.findAll().isEmpty()) {
            message = "Aun no hay registros";
        } else {
            message = "Operación exitosa";
            list = customerRepository.findAll();
        }
        return customResponseEntity.getOkResponse(message, list);
    }

    // Obtener cliente por ID
    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long id) {
        Customer found = customerRepository.findById(id);
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
            customerRepository.save(customer);
            return customResponseEntity.getOkResponse("Registro exitoso", "null");
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
                customerRepository.save(customer);
                return customResponseEntity.getOkResponse("Actualización exitosa", null);
            } catch (Exception e) {
                return customResponseEntity.get400Response();
            }
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> deleteById(long id) {
        Customer found = customerRepository.findById(id);
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            customerRepository.deleteById(id);

            // Retornar respuesta de éxito
            return customResponseEntity.getOkResponse("Eliminado correctamente", null);
        }
    }
}

