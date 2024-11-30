package mx.edu.utez.adm.modules.car;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import mx.edu.utez.adm.modules.brand.Brand;
import mx.edu.utez.adm.modules.customer.Customer;
import mx.edu.utez.adm.modules.service.Service;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "car")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "color", nullable = false)
    private String color;

    @Column(name = "register_date", nullable = false)
    private String registerDate;

    @Column(name = "sale_date")
    private String saleDate;

    @Column(name = "base_price", nullable = false)
    private double basePrice;

    @Column(name = "total_price", nullable = false)
    private double totalPrice;

    @Column(name = "onSale", nullable = false)
    private boolean onSale;

    //Atributos de relacion
    //Relacion de muchos a uno con brand
    @ManyToOne
    @JoinColumn(name = "id_brand", nullable = false)
    private Brand brand;

    //Relacion de uno a muchos con customer - Opcional por que no tiene customer cuando esta en venta
    @ManyToOne
    @JoinColumn(name = "id_customer")
    private Customer customer;

    //Relacion de muchos a muchos con service
    @ManyToMany
    @JoinTable(
            name = "car_has_service",
            joinColumns = @JoinColumn(name = "id_car"),
            inverseJoinColumns = @JoinColumn(name = "id_service")
    )
    private List<Service> services;

    public Car() {
    }

    public Car(String model, String color, String registerDate, double basePrice, double totalPrice, boolean onSale) {
        this.model = model;
        this.color = color;
        this.registerDate = registerDate;
        this.basePrice = basePrice;
        this.totalPrice = totalPrice;
        this.onSale = onSale;
    }

    public Car(long id, String model, String color, String registerDate, String saleDate, double basePrice, double totalPrice, boolean onSale) {
        this.id = id;
        this.model = model;
        this.color = color;
        this.registerDate = registerDate;
        this.saleDate = saleDate;
        this.basePrice = basePrice;
        this.totalPrice = totalPrice;
        this.onSale = onSale;
    }

    public Car(String model, String color, String registerDate, String saleDate, double basePrice, double totalPrice, boolean onSale, Brand brand, Customer customer, List<Service> services) {
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

    public Car(long id, String model, String color, String registerDate, String saleDate, double basePrice, double totalPrice, boolean onSale, Brand brand, Customer customer, List<Service> services) {
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
}


