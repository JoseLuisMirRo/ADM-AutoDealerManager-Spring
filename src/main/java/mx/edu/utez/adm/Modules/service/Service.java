package mx.edu.utez.adm.Modules.service;

import jakarta.persistence.*;
import mx.edu.utez.adm.modules.car.Car;

import java.util.List;

@Entity
@Table(name = "service")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "price", nullable = false)
    private Double price;

    //Atributos de relacion
    //Relacion de muchos a muchos con car
    @ManyToMany(mappedBy = "services")
    private List<Car> cars;
}
