package mx.edu.utez.adm.modules.brand;

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

    //Atributos de relacion
    //Relacion de uno a muchos con car
    @OneToMany(mappedBy = "brand")
    private List<Car> cars;

    public Brand() {
    }

    public Brand(String name) {
        this.name = name;
    }

    public Brand(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Brand(List<Car> cars, String name) {
        this.cars = cars;
        this.name = name;
    }

    public Brand(long id, String name, List<Car> cars) {
        this.id = id;
        this.name = name;
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

    public List<Car> getCars() {
        return cars;
    }

    public void setCars(List<Car> cars) {
        this.cars = cars;
    }
}
