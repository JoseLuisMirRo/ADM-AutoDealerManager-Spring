package mx.edu.utez.adm.modules.service;

import mx.edu.utez.adm.modules.customer.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/adm/service")  // Cambiado para usar el endpoint "/adm/service"
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return serviceService.findAll();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable long id) {
        return serviceService.findById(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Service service) {
        return serviceService.save(service);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody Service service, @PathVariable long id) {
        return serviceService.update(service, id);
    }

    // Cambiar el estado de un servicio
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @PutMapping("/status")
    public ResponseEntity<?> changeStatus(@RequestBody Service service) {
        return serviceService.changeStatus(service);
    }

    //Traer servicios activos
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @GetMapping("/active")
    public ResponseEntity<?> findAllActive() {
        return serviceService.findAllActive();
    }

}
