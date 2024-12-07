package mx.edu.utez.adm.modules.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Modifying
    @Query(value = "UPDATE employee SET status = :status WHERE id = :id", nativeQuery = true)
    void changeStatus(long id, boolean status);

    //Auth
    @Query(value = "SELECT * FROM employee WHERE password = :password AND username = :username;", nativeQuery = true)
    Employee findByPasswordAndEmailOrUsername(@Param("password") String password, @Param("username") String username);

    Employee findByUsername(String username);

    //Traer empleados activos
    @Query(value = "SELECT * FROM employee WHERE status = 1", nativeQuery = true)
    List<Employee> findAllActive();
}
