package mx.edu.utez.adm.modules.customer;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.adm.modules.car.Car;
import mx.edu.utez.adm.modules.employee.Employee;

import java.util.List;

@Entity
@Table(name = "customer")
public class Customer {
    //Atributos de la entidad
    //Atributos propios de la clase
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "lastname", nullable = false)
    private String lastname;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "status", nullable = false)
    private boolean status;

    //Atributos de relaciones
    //Relacion de muchos a uno con employee
    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private Employee employee;

    //Relacion de uno a muchos con car
    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private List<Car> cars;

    public Customer() {
    }

    public Customer(String name, String surname, String lastname, String phone, String email, boolean status) {
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.phone = phone;
        this.email = email;
        this.status = status;
    }

    public Customer(long id, String name, String surname, String lastname, String phone, String email, boolean status) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.phone = phone;
        this.email = email;
        this.status = status;
    }

    public Customer(String name, String surname, String lastname, String phone, String email, boolean status, Employee employee, List<Car> cars) {
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.phone = phone;
        this.email = email;
        this.status = status;
        this.employee = employee;
        this.cars = cars;
    }

    public Customer(long id, String name, String surname, String lastname, String phone, String email, boolean status,  Employee employee, List<Car> cars) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.phone = phone;
        this.email = email;
        this.status = status;
        this.employee = employee;
        this.cars = cars;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public List<Car> getCars() {
        return cars;
    }

    public void setCars(List<Car> cars) {
        this.cars = cars;
    }
}
