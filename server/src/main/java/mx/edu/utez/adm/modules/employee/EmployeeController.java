package mx.edu.utez.adm.modules.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/adm/employee")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    //ENDPOINTS
    //Traer todos los empleados
    @GetMapping("")
    private ResponseEntity<?> findAll(){
        return employeeService.findAll();
    }

    //Traer empleado por id
    @GetMapping("/{idEmployee}")
    private ResponseEntity<?> findById(@PathVariable("idEmployee") long idEmployee){
        return employeeService.findById(idEmployee);
    }

    //Traer empleados por rol
    @GetMapping("/rol/{idRol}")
    private ResponseEntity<?> findAllByRol(@PathVariable("idRol")  int idRol){
        return employeeService.findAllByIdRol(idRol);
    }

    //Guardar empleado
    @PostMapping("")
    private ResponseEntity<?> save(@RequestBody Employee employee){
        return employeeService.save(employee);
    }

    //Actualizar empleado
    @PutMapping("")
    private ResponseEntity<?> update(@RequestBody Employee employee){
        return employeeService.update(employee);
    }

    //Cambiar estado de empleado
    @PutMapping("/status")
    private ResponseEntity<?> changeStatus(@RequestBody Employee employee){
        return employeeService.changeStatus(employee);
    }

    //Eliminar empleado
    @DeleteMapping("")
    private ResponseEntity<?> deleteById(@RequestBody Employee idEmployee){
        return employeeService.deleteById(idEmployee);
    }
}
