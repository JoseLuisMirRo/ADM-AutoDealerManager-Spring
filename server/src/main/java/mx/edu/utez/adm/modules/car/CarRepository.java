package mx.edu.utez.adm.modules.car;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    Car findById(long id);

    Car save(Car car);

    void deleteById(long id);

    //Traer todos los autos disponibles para venta
    @Query(value = "SELECT * FROM car WHERE on_sale = true", nativeQuery = true)
    List<Car> findByIsOnSale();

    //Traer todos los autos por id de cliente
    @Query(value = "SELECT * FROM car WHERE id_customer = :customerId", nativeQuery = true)
    List<Car> findAllByIdCustomer(long customerId);

    //Traer autos de los clientes a cargo de un empleado
    @Query(value = "SELECT * FROM car WHERE id_customer IN (SELECT id FROM customer WHERE id_employee = :idEmployee)", nativeQuery = true)
    List<Car> findAllByEmployeeCustomer(long idEmployee);
}
