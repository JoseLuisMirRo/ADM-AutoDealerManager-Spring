package mx.edu.utez.adm.modules.car.DTO;

import mx.edu.utez.adm.modules.brand.Brand;
import mx.edu.utez.adm.modules.customer.DTO.CustomerDTOForCar;
import mx.edu.utez.adm.modules.service.DTO.ServiceCarDTO;
import mx.edu.utez.adm.modules.service.Service;

import java.util.List;

public class FindCarDTO {
    private long id;
    private String model;
    private String color;
    private String registerDate;
    private String saleDate;
    private double basePrice;
    private double totalPrice;
    private boolean onSale;
    private Brand brand;
    private CustomerDTOForCar customer;
    private List<ServiceCarDTO> services;

    public FindCarDTO() {
    }

    public FindCarDTO(long id, String model, String color, String registerDate, String saleDate, double basePrice, double totalPrice, boolean onSale, Brand brand, CustomerDTOForCar customer, List<ServiceCarDTO> services) {
        this.id = id;
        this.model = model;
        this.color = color;
        this.registerDate = registerDate;
        this.saleDate = saleDate;
        this.basePrice = basePrice;
        this.totalPrice = totalPrice;
        this.onSale = onSale;
        this.brand = brand;
        this.customer = customer;
        this.services = services;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getRegisterDate() {
        return registerDate;
    }

    public void setRegisterDate(String registerDate) {
        this.registerDate = registerDate;
    }

    public String getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(String saleDate) {
        this.saleDate = saleDate;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public boolean isOnSale() {
        return onSale;
    }

    public void setOnSale(boolean onSale) {
        this.onSale = onSale;
    }

    public Brand getBrand() {
        return brand;
    }

    public void setBrand(Brand brand) {
        this.brand = brand;
    }

    public CustomerDTOForCar getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerDTOForCar customer) {
        this.customer = customer;
    }

    public List<ServiceCarDTO> getServices() {
        return services;
    }

    public void setServices(List<ServiceCarDTO> services) {
        this.services = services;
    }
}
