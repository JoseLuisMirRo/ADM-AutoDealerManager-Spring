package mx.edu.utez.adm.modules.brand;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/adm/brand")
public class BrandController {
    @Autowired
    private BrandService brandService;

    //ENDPOINTS
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("")
    public ResponseEntity<?> findAll(){
        return brandService.findAll();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/{idBrand}")
    public ResponseEntity<?> findById(@PathVariable long idBrand){
        return brandService.findById(idBrand);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Brand brand){
        return brandService.save(brand);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody Brand brand){
        return brandService.update(brand);
    }

    //@DeleteMapping("")
    //private ResponseEntity<?> deleteById(@RequestBody Brand brand){
        //return brandService.deleteById(brand);
    //}

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/status")
    public ResponseEntity<?> changeStatus(@RequestBody Brand brand){
        return brandService.changeStatus(brand);
    }

    //Traer marcas activas
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/active")
    public ResponseEntity<?> findAllActive(){
        return brandService.findAllActive();
    }

}
