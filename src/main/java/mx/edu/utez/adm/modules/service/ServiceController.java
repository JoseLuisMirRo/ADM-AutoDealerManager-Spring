package mx.edu.utez.adm.modules.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/adm/service")  // Cambiado para usar el endpoint "/adm/service"
public class ServiceController {

    @Autowired
    private SService sService;

    @GetMapping("")
    public ResponseEntity<?> findAll() {
        return sService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable long id) {
        return sService.findById(id);
    }

    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Service service) {
        return sService.save(service);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@RequestBody Service service, @PathVariable long id) {
        return sService.update(service, id);
    }
}
