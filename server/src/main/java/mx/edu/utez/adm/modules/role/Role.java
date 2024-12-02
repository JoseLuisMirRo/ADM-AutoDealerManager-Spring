package mx.edu.utez.adm.modules.role;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.adm.modules.employee.Employee;

import java.util.List;

@Entity
@Table(name = "role")
public class Role {
    //---------Atributos Propios de la Clase---------//
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    //---------Atributos de Relacion---------//
    @OneToMany(mappedBy = "role")
    @JsonIgnore
    private List<Employee> employees;

    //---------Constructores---------//
    public Role() {
    }

    public Role(String name) {
        this.name = name;
    }

    public Role(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public Role(String name, List<Employee> employees) {
        this.name = name;
        this.employees = employees;
    }

    public Role(int id, String name, List<Employee> employees) {
        this.id = id;
        this.name = name;
        this.employees = employees;
    }

    //---------Getters y Setters---------//
    public int getId() {
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

    public List<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
    }


}

