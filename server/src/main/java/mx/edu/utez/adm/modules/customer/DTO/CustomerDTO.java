package mx.edu.utez.adm.modules.customer.DTO;

import mx.edu.utez.adm.modules.employee.DTO.EmployeeCustomerDTO;

public class CustomerDTO {
    private long id;
    private String name;
    private String lastname;
    private String surname;
    private String phone;
    private String email;
    private boolean status;
    private EmployeeCustomerDTO employee;

    public CustomerDTO() {
    }

    public CustomerDTO(long id, String name, String lastname, String surname, String phone, String email, boolean status, EmployeeCustomerDTO employee) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.surname = surname;
        this.phone = phone;
        this.email = email;
        this.status = status;
        this.employee = employee;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public EmployeeCustomerDTO getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeCustomerDTO employee) {
        this.employee = employee;
    }
}
