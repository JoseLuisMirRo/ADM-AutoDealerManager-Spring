package mx.edu.utez.adm.modules.car;

import mx.edu.utez.adm.modules.car.DTO.CarSaleDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/adm/car")
public class CarController {
    @Autowired
    private CarService carService;

    //ENDPOINTS
    @GetMapping("")
    private ResponseEntity<?> findAll(){
        return carService.findAll();
    }

    @GetMapping("/{idCar}")
    private ResponseEntity<?> findById(@PathVariable long idCar){
        return carService.findById(idCar);
    }

    //Vender auto
    @PutMapping("/sell")
    private ResponseEntity<?> sellCar(@RequestBody CarSaleDTO car){
        return carService.sell(car);
    }
    @PostMapping("")
    private ResponseEntity<?> save(@RequestBody Car car){
        return carService.save(car);
    }

    @PutMapping("")
    private ResponseEntity<?> update(@RequestBody Car car){
        return carService.update(car);
    }

    @DeleteMapping("")
    private ResponseEntity<?> deleteById(@RequestBody Car car){
        return carService.deleteById(car);
    }
}
