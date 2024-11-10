package mx.edu.utez.adm.modules.rol;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.adm.modules.employee.Employee;

import java.util.List;

@Entity
@Table(name = "rol")
public class Rol {
    //---------Atributos Propios de la Clase---------//
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    //---------Atributos de Relacion---------//
    @OneToMany(mappedBy = "rol")
    @JsonIgnore
    private List<Employee> employees;

}

