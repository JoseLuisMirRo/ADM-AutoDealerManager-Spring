package mx.edu.utez.adm.modules.service;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    @Modifying
    @Query(value = "DELETE FROM car_has_service WHERE id_car = :id", nativeQuery = true)
    void deleteByCarId(long id);
}

