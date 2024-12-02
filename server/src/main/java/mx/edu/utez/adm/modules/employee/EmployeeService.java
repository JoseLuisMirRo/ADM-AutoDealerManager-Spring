package mx.edu.utez.adm.modules.employee;

import mx.edu.utez.adm.modules.employee.DTO.EmployeeDTO;
import mx.edu.utez.adm.modules.role.Role;
import mx.edu.utez.adm.modules.role.RoleRepository;
import mx.edu.utez.adm.utils.CustomResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    public EmployeeDTO transformEmployeeToDTO(Employee e){
        return new EmployeeDTO(
            e.getId(),
            e.getUsername(),
            e.getName(),
            e.getSurname(),
            e.getLastname(),
                e.getRole(),
                e.isStatus()
        );
    }

    //Traer todos los empleados
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll(){
        List<EmployeeDTO> list = new ArrayList<>();
        String message = "";
        if(employeeRepository.findAll().isEmpty()) {
            message = "Aun no hay registros";
        } else {
            message = "Operacion exitosa";
            for(Employee e : employeeRepository.findAll()){
                list.add(transformEmployeeToDTO(e));
            }
        }
        return customResponseEntity.getOkResponse(message, list);
    }

    //Traer empleado por id
    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long id){
        Employee found = employeeRepository.findById(id);
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            return customResponseEntity.getOkResponse(
                    "Operación exitosa",
                    transformEmployeeToDTO(found)
            );
        }
    }

    //Traer empleados por id rol
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAllByIdRol(int idRol){
        List<EmployeeDTO> list = new ArrayList<>();
        if(!roleRepository.existsById(idRol)){
            return customResponseEntity.get404Response();
        }
        String message = "";
        if(employeeRepository.findAllByIdRol(idRol).isEmpty()) {
            message = "Aun no hay registros";
        } else {
            message = "Operacion exitosa";
            for(Employee e : employeeRepository.findAllByIdRol(idRol)){
                list.add(transformEmployeeToDTO(e));
            }
        }
        return customResponseEntity.getOkResponse(message, list);
    }

    //Guardar un empleado
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> save(Employee employee){
        employee.setStatus(true);
        employee.setPassword(employee.getUsername());
        employee.setRole(new Role(2,null));
        try{
            employeeRepository.save(employee);
            return customResponseEntity.getOkResponse(
                    "Registro exitoso",
                    null
            );
        }catch (Exception e){
            e.printStackTrace();
            return customResponseEntity.get400Response();
        }
    }

    //Actualizar un empleado
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> update(Employee employee){
        Employee found = employeeRepository.findById(employee.getId());
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            try{
                employee.setRole(found.getRole());
                employee.setStatus(found.isStatus());
                employee.setPassword(found.getPassword());
                employeeRepository.save(employee);
                return customResponseEntity.getOkResponse(
                        "Actualizacion exitosa",
                        null
                );
            }catch (Exception e){
                e.printStackTrace();
                return customResponseEntity.get400Response();
            }
        }
    }

    //Cambiar estado de un empleado
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> changeStatus(Employee employee){
        Employee found = employeeRepository.findById(employee.getId());
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            try{
                found.setStatus(employee.isStatus());
                employeeRepository.changeStatus(found.getId(), found.isStatus());
                return customResponseEntity.getOkResponse(
                        "Actualizacion de estado exitosa",
                        null
                );
            }catch (Exception e){
                e.printStackTrace();
                return customResponseEntity.get400Response();
            }
        }
    }

    //Eliminar un empleado
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> deleteById(Employee employee){
        Employee found = employeeRepository.findById(employee.getId());
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            try{
                employeeRepository.deleteById(employee.getId());
                return customResponseEntity.getOkResponse(
                        "Eliminacion exitosa",
                        null
                );
            }catch (Exception e){
                return customResponseEntity.get400Response();
            }
        }
    }
}
