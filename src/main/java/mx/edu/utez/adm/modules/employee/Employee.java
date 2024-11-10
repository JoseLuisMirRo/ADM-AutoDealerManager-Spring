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
    private String userName;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "surname", nullable = false)
    private String surName;

    @Column(name = "lastname", nullable = false)
    private String lastName;

    //Relacion de muchos a uno con rol
    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    //Relacion de uno a muchos con customer
    @OneToMany(mappedBy = "employee")
    @JsonIgnore
    private List<Customer> customers;






}
