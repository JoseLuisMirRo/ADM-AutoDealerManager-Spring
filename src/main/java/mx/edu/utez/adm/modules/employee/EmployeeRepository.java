package mx.edu.utez.adm.modules.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository  extends JpaRepository<Employee, Long> {
    List<Employee> findAll();

    Employee findById(long idEmployee);

    //Traer todos los empleados por id rol
    @Query(value = "SELECT * FROM employee WHERE id_rol = :idRol", nativeQuery = true)
    List<Employee> findAllByIdRol(int idRol);

    Employee save(Employee employee);

    void deleteById(long id);
}
