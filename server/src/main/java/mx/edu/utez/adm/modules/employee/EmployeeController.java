package mx.edu.utez.adm.modules.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/adm/employee")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    //ENDPOINTS
    //Traer todos los empleados
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("")
    public ResponseEntity<?> findAll(){
        return employeeService.findAll();
    }

    //Traer empleado por id
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/{idEmployee}")
    public ResponseEntity<?> findById(@PathVariable("idEmployee") long idEmployee){
        return employeeService.findById(idEmployee);
    }

    //Traer empleados por rol
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/rol/{idRol}")
    public ResponseEntity<?> findAllByRol(@PathVariable("idRol")  int idRol){
        return employeeService.findAllByIdRol(idRol);
    }

    //Guardar empleado
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> save(@RequestBody Employee employee){
        return employeeService.save(employee);
    }

    //Actualizar empleado
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody Employee employee){
        return employeeService.update(employee);
    }

    //Cambiar estado de empleado
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/status")
    public ResponseEntity<?> changeStatus(@RequestBody Employee employee){
        return employeeService.changeStatus(employee);
    }

    //Eliminar empleado
    //@DeleteMapping("")
    //private ResponseEntity<?> deleteById(@RequestBody Employee idEmployee){
      //  return employeeService.deleteById(idEmployee);
    //}
}
