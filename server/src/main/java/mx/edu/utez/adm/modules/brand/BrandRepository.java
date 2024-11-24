package mx.edu.utez.adm.modules.brand;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Brand findById(long id);

    Brand save(Brand brand);

    void deleteById(long id);

    @Query("SELECT b FROM Brand b WHERE b.name = :name")
    Brand findByName(String name);

}
