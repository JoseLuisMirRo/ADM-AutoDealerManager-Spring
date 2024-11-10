package mx.edu.utez.adm.modules.employee.DTO;

import mx.edu.utez.adm.modules.rol.Rol;

public class EmployeeDTO {
    private long id;
    private String username, name, surname, lastname;
    private Rol rol;

    public EmployeeDTO() {
    }

    public EmployeeDTO(long id, String username, String name, String surname, String lastname, Rol rol) {
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

}
