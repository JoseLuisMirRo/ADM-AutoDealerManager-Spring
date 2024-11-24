package mx.edu.utez.adm.modules.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/adm/service")  // Cambiado para usar el endpoint "/adm/service"
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return serviceService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable long id) {
        return serviceService.findById(id);
    }

    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Service service) {
        return serviceService.save(service);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody Service service, @PathVariable long id) {
        return serviceService.update(service, id);
    }
}
