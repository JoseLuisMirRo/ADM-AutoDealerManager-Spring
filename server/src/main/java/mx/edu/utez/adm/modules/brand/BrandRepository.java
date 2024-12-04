package mx.edu.utez.adm.modules.brand;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Brand findById(long id);

    Brand save(Brand brand);

    void deleteById(long id);

    @Query("SELECT b FROM Brand b WHERE b.name = :name")
    Brand findByName(String name);

    @Modifying
    @Query(value = "UPDATE brand SET status = :status WHERE id = :id", nativeQuery = true)
    void changeStatus(long id, boolean status);


}
