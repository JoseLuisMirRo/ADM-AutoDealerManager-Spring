package mx.edu.utez.adm.modules.brand;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/adm/brand")
public class BrandController {
    @Autowired
    private BrandService brandService;

    //ENDPOINTS
    @GetMapping("")
    private ResponseEntity<?> findAll(){
        return brandService.findAll();
    }

    @GetMapping("/{idBrand}")
    private ResponseEntity<?> findById(@PathVariable long idBrand){
        return brandService.findById(idBrand);
    }

    @PostMapping("")
    private ResponseEntity<?> save(@RequestBody Brand brand){
        return brandService.save(brand);
    }

    @PutMapping("")
    private ResponseEntity<?> update(@RequestBody Brand brand){
        return brandService.update(brand);
    }

    @DeleteMapping("")
    private ResponseEntity<?> deleteById(@RequestBody Brand brand){
        return brandService.deleteById(brand);
    }

}
