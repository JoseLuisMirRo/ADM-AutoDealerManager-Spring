package mx.edu.utez.adm.modules.customer;

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

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "lastname", nullable = false)
    private String lastname;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "email", nullable = false)
    private String email;

    //Atributos de relaciones
    //Relacion de muchos a uno con employee
    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private Employee employee;

    //Relacion de uno a muchos con car
    @OneToMany(mappedBy = "customer")
    private List<Car> cars;

}
