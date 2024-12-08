package mx.edu.utez.adm.modules.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/adm/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // Obtener todos los clientes
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllCustomers() {
        return customerService.findAll();
    }

    // Obtener un cliente por ID
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable long id) {
        return customerService.findById(id);
    }

    //Traer clientes por empleado
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @GetMapping("/employee/{idEmployee}")
    public ResponseEntity<?> findAllByIdEmployee(@PathVariable long idEmployee) {
        return customerService.findAllByEmployeeId(idEmployee);
    }

    //Traer clientes por empleado y por id
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @GetMapping("/employee/{idEmployee}/{idCustomer}")
    public ResponseEntity<?> findByIdEmployee(@PathVariable long idEmployee, @PathVariable long idCustomer) {
        return customerService.findByIdEmployee(idEmployee, idCustomer);
    }

    //Traer clientes activos
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @GetMapping("/active")
    public ResponseEntity<?> findAllActive() {
        return customerService.findAllActive();
    }

    // Crear un nuevo cliente
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        return customerService.save(customer);
    }

    // Actualizar un cliente existente
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @PutMapping("")
    public ResponseEntity<?> updateCustomer(@RequestBody Customer customer) {// Asegura que el ID de la entidad coincide con el de la URL
        return customerService.update(customer);
    }

    // Eliminar un cliente
    //@DeleteMapping("")
    //public ResponseEntity<?> deleteCustomer(@RequestBody Customer customer) {
    //    return customerService.deleteById(customer);
    //}

    // Cambiar el estado de un cliente
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @PutMapping("/status")
    public ResponseEntity<?> changeStatus(@RequestBody Customer customer) {
        return customerService.changeStatus(customer);
    }
}
