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
    @Column(name = "id", nullable = false)
    private long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "status", nullable = false)
    private boolean status;

    //Atributos de relacion
    //Relacion de uno a muchos con car
    @OneToMany(mappedBy = "brand")
    @JsonIgnore
    private List<Car> cars;

    public Brand() {
    }

    public Brand(String name, boolean status) {
        this.name = name;
        this.status = status;
    }

    public Brand(long id, String name, boolean status) {
        this.id = id;
        this.name = name;
        this.status = status;
    }

    public Brand(List<Car> cars, String name, boolean status) {
        this.cars = cars;
        this.name = name;
        this.status = status;
    }

    public Brand(long id, String name, boolean status,List<Car> cars) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.cars = cars;
    }

    public long getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public List<Car> getCars() {
        return cars;
    }

    public void setCars(List<Car> cars) {
        this.cars = cars;
    }
}
