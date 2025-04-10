package mx.edu.utez.adm.modules.service;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "status", nullable = false)
    private boolean status;

    //Atributos de relacion
    //Relacion de muchos a muchos con car
    @ManyToMany(mappedBy = "services")
    @JsonIgnore
    private List<Car> cars;

    public Service() {
    }

    public Service(String name, String code, String description, Double price, boolean status) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.price = price;
        this.status = status;
    }

    public Service(Long id, String name, String code, String description, Double price, boolean status) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.price = price;
        this.status = status;
    }

    public Service(String name, String code, String description, Double price, Boolean status, List<Car> cars) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.price = price;
        this.status = status;
        this.cars = cars;
    }

    public Service(Long id, String name, String code, String description, Double price, boolean status, List<Car> cars) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.price = price;
        this.status = status;
        this.cars = cars;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public List<Car> getCars() {
        return cars;
    }

    public void setCars(List<Car> cars) {
        this.cars = cars;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

}
