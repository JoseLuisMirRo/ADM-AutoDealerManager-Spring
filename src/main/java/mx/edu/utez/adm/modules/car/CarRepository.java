package mx.edu.utez.adm.modules.car;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository extends JpaRepository<Car, Long> {
    Car findById(long id);

    Car save(Car car);

    void deleteById(long id);

}
