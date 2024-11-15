package mx.edu.utez.adm.modules.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // Obtener todos los clientes
    @GetMapping
    public ResponseEntity<?> getAllCustomers() {
        return customerService.findAll();
    }

    // Obtener un cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable long id) {
        return customerService.findById(id);
    }

    // Crear un nuevo cliente
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        return customerService.save(customer);
    }

    // Actualizar un cliente existente
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable long id, @RequestBody Customer customer) {
        customer.setId(id); // Asegura que el ID de la entidad coincide con el de la URL
        return customerService.update(customer);
    }

    // Eliminar un cliente por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable long id) {
        return customerService.deleteById(id);
    }
}
