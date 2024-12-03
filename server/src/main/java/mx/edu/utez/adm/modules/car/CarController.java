package mx.edu.utez.adm.modules.car;

import mx.edu.utez.adm.modules.car.DTO.CarSaleDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/adm/car")
public class CarController {

    @Autowired
    private CarService carService;

    //ENDPOINTS
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @GetMapping("")
    public ResponseEntity<?> findAll(){
        return carService.findAll();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @GetMapping("/{idCar}")
    public ResponseEntity<?> findById(@PathVariable long idCar){
        return carService.findById(idCar);
    }

    //Vender auto
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OPERATOR')")
    @PutMapping("/sell")
    public ResponseEntity<?> sellCar(@RequestBody CarSaleDTO car){
        return carService.sell(car);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Car car){
        return carService.save(car);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody Car car){
        return carService.update(car);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public ResponseEntity<?> deleteById(@RequestBody Car car){
        return carService.deleteById(car);
    }
}
