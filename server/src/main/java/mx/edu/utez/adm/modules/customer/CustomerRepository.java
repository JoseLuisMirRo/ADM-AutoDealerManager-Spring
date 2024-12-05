package mx.edu.utez.adm.modules.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Traer todos los clientes
    List<Customer> findAll();

    // Traer todos los clientes por empleado asignado
    @Query(value = "SELECT * FROM customer WHERE id_employee = :employeeId", nativeQuery = true)
    List<Customer> findAllByEmployeeId(@Param("employeeId") long employeeId);

    // Traer un cliente por ID
    Customer findById(long id);

    //Traer clientes por empleado y por id
    @Query(value = "SELECT * FROM customer WHERE id_employee = :employeeId AND id = :id", nativeQuery = true)
    Customer findByIdAndEmployeeId(@Param("id") long id, @Param("employeeId") long employeeId);

    // Guardar/Actualizar un cliente
    Customer save(Customer customer);

    // Buscar clientes por su email
    @Query(value = "SELECT * FROM customer WHERE email = :email", nativeQuery = true)
    Customer findByEmail(@Param("email") String email);

    // Buscar clientes por nombre completo
    @Query(value = "SELECT * FROM customer WHERE name = :name AND surname = :surname AND lastname = :lastname", nativeQuery = true)
    List<Customer> findByFullName(
            @Param("name") String name,
            @Param("surname") String surname,
            @Param("lastname") String lastname
    );


    // Cambiar el estado de un cliente
    @Modifying
    @Query(value = "UPDATE customer SET status = :status WHERE id = :id", nativeQuery = true)
    void changeStatus(long id, boolean status);
}

