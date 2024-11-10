package mx.edu.utez.adm.modules.brand;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.adm.modules.car.Car;

import java.util.List;

@Entity
@Table(name = "brand")
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name", nullable = false)
    private String name;

    //Atributos de relacion
    //Relacion de uno a muchos con car
    @OneToMany(mappedBy = "brand")
    @JsonIgnore
    private List<Car> cars;

}
