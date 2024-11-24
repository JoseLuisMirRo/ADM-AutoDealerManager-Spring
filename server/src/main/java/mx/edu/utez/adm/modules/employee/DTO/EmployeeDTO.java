package mx.edu.utez.adm.modules.employee.DTO;

import mx.edu.utez.adm.modules.role.Role;

public class EmployeeDTO {
    private long id;
    private String username, name, surname, lastname;
    private Role rol;

    public EmployeeDTO() {
    }

    public EmployeeDTO(long id, String username, String name, String surname, String lastname, Role rol) {
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

    public Role getRol() {
        return rol;
    }

    public void setRol(Role rol) {
        this.rol = rol;
    }

}
