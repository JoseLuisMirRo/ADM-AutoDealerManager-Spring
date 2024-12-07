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

    Service findById(long id);


    @Modifying
    @Query(value = "UPDATE service SET status = :status WHERE id = :id", nativeQuery = true)
    void changeStatus(long id, boolean status);
}

