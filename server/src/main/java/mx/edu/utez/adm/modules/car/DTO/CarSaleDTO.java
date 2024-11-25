package mx.edu.utez.adm.modules.car.DTO;

import mx.edu.utez.adm.modules.customer.Customer;
import mx.edu.utez.adm.modules.service.Service;

import java.util.List;

public class CarSaleDTO {
    private long id;
    private Customer customer;
    private List<Service> services;
    private double totalPrice;
    private String saleDate;
    private boolean onSale;

    public CarSaleDTO() {
    }

    public CarSaleDTO(long id, Customer customer, List<Service> services, double totalPrice, String saleDate, boolean onSale) {
        this.id = id;
        this.customer = customer;
        this.services = services;
        this.totalPrice = totalPrice;
        this.saleDate = saleDate;
        this.onSale = onSale;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<Service> getServices() {
        return services;
    }

    public void setServices(List<Service> services) {
        this.services = services;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(String saleDate) {
        this.saleDate = saleDate;
    }

    public boolean isOnSale() {
        return onSale;
    }

    public void setOnSale(boolean onSale) {
        this.onSale = onSale;
    }


}
