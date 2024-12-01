package mx.edu.utez.adm.modules.employee.DTO;

public class EmployeeCustomerDTO {
    private long id;
    private String name, lastname, surname;

    public EmployeeCustomerDTO() {
    }

    public EmployeeCustomerDTO(long id, String name, String lastname, String surname) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.surname = surname;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }
}
