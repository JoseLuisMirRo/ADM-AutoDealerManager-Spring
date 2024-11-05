package mx.edu.utez.adm.Modules.Rol;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.adm.Modules.Employee.Employee;

import java.util.List;

@Entity
@Table(name = "rol")
public class Rol {
    //---------Atributos Propios de la Clase---------//
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    //---------Atributos de Relacion---------//
    @OneToMany(mappedBy = "rol")
    @JsonIgnore
    private List<Employee> Employes;

}

