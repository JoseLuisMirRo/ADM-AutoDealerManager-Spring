package mx.edu.utez.adm.modules.employee;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.adm.modules.customer.Customer;
import mx.edu.utez.adm.modules.role.Role;

import java.util.List;

@Entity
@Table(name = "Employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "lastname", nullable = false)
    private String lastname;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "password", nullable = false)
    private String password;

    //Relacion de muchos a uno con rol
    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Role rol;

    //Relacion de uno a muchos con customer
    @OneToMany(mappedBy = "employee")
    @JsonIgnore
    private List<Customer> customers;

    public Employee() {
    }

    public Employee(String username, String name, String surname, String lastname, String password) {
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.password = password;
    }

    public Employee(long id, String username, String name, String surname, String lastname, String password) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.password = password;
    }

    public Employee(String username, String name, String surname, String lastname, String password, Role rol) {
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.password = password;
        this.rol = rol;
    }

    public Employee(long id, String username, String name, String surname, String lastname, String password, Role rol) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.lastname = lastname;
        this.password = password;
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

    public Role getRol() {
        return rol;
    }

    public void setRol(Role rol) {
        this.rol = rol;
    }

    public List<Customer> getCustomers() {
        return customers;
    }

    public void setCustomers(List<Customer> customers) {
        this.customers = customers;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
