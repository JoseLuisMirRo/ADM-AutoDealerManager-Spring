package mx.edu.utez.adm.Modules.Employee;

import jakarta.persistence.*;
import mx.edu.utez.adm.Modules.Rol.Rol;

@Entity
@Table(name = "Employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;
    @Column(name = "username")
    private String userName;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "surname", nullable = false)
    private String surName;

    @Column(name = "lastname", nullable = false)
    private String lastName;

    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;






}
