package mx.edu.utez.adm.modules.employee;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.adm.modules.customer.Customer;
import mx.edu.utez.adm.modules.rol.Rol;

import java.util.List;

@Entity
@Table(name = "Employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "username")
    private String username;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "lastname", nullable = false)
    private String lastname;

    //Relacion de muchos a uno con rol
    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    //Relacion de uno a muchos con customer
    @OneToMany(mappedBy = "employee")
    @JsonIgnore
    private List<Customer> customers;

    public Employee() {
    }

    public Employee(String username, String name, String surname, String lastname) {
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
    }

    public Employee(long id, String username, String name, String surname, String lastname) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
    }

    public Employee(String username, String name, String surname, String lastname, Rol rol) {
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.rol = rol;
    }

    public Employee(long id, String username, String name, String surname, String lastname, Rol rol) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.rol = rol;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public List<Customer> getCustomers() {
        return customers;
    }

    public void setCustomers(List<Customer> customers) {
        this.customers = customers;
    }
}
