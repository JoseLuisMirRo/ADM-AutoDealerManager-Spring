package mx.edu.utez.adm.modules.car;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.adm.modules.brand.Brand;
import mx.edu.utez.adm.modules.customer.Customer;
import mx.edu.utez.adm.modules.service.Service;

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
    private String registerDate;

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

    public Car() {
    }

    public Car(String model, String color, String registerDate, double price) {
        this.model = model;
        this.color = color;
        this.registerDate = registerDate;
        this.price = price;
    }

    public Car(long id, String model, String color, String registerDate, double price) {
        this.id = id;
        this.model = model;
        this.color = color;
        this.registerDate = registerDate;
        this.price = price;
    }

    public Car(String model, String color, String registerDate, double price, Brand brand, Customer customer, List<Service> services) {
        this.model = model;
        this.color = color;
        this.registerDate = registerDate;
        this.price = price;
        this.brand = brand;
        this.customer = customer;
        this.services = services;
    }

    public Car(long id, String model, String color, String registerDate, double price, Brand brand, Customer customer, List<Service> services) {
        this.id = id;
        this.model = model;
        this.color = color;
        this.registerDate = registerDate;
        this.price = price;
        this.brand = brand;
        this.customer = customer;
        this.services = services;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getRegisterDate() {
        return registerDate;
    }

    public void setRegisterDate(String registerDate) {
        this.registerDate = registerDate;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<Service> getServices() {
        return services;
    }

    public void setServices(List<Service> services) {
        this.services = services;
    }
}
