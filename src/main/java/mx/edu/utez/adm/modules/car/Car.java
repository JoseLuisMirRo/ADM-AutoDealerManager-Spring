package mx.edu.utez.adm.modules.car;

import jakarta.persistence.*;
import mx.edu.utez.adm.modules.brand.Brand;
import mx.edu.utez.adm.modules.customer.Customer;
import mx.edu.utez.adm.service.Service;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "car")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name="model", nullable = false)
    private String model;

    @Column(name="color", nullable = false)
    private String color;

    @Column(name="register_date", nullable = false)
    private Date registerDate;

    @Column(name="price", nullable = false)
    private double price;

    //Atributos de relacion
    //Relacion de muchos a uno con brand
    @ManyToOne
    @JoinColumn(name = "id_brand", nullable = false)
    private Brand brand;

    //Relacion de uno a muchos con customer
    @ManyToOne
    @JoinColumn(name = "id_customer", nullable = false)
    private Customer customer;

    //Relacion de muchos a muchos con service
    @ManyToMany
    @JoinTable(
            name = "car_has_service",
            joinColumns = @JoinColumn(name = "id_car"),
            inverseJoinColumns = @JoinColumn(name = "id_service")
    )
    private List<Service> services;
}
