package mx.edu.utez.adm.modules.car;

import mx.edu.utez.adm.modules.brand.Brand;
import mx.edu.utez.adm.modules.brand.BrandRepository;
import mx.edu.utez.adm.modules.car.DTO.CarSaleDTO;
import mx.edu.utez.adm.modules.car.DTO.FindCarDTO;
import mx.edu.utez.adm.modules.customer.Customer;
import mx.edu.utez.adm.modules.customer.CustomerRepository;
import mx.edu.utez.adm.modules.customer.DTO.CustomerDTOForCar;
import mx.edu.utez.adm.modules.service.DTO.ServiceCarDTO;
import mx.edu.utez.adm.modules.service.ServiceRepository;
import mx.edu.utez.adm.utils.CustomResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@Service
public class CarService {
    @Autowired
    private CarRepository carRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ServiceRepository serviceRepository;


    //Transformar Customer a CustomerDTOForCar
    public CustomerDTOForCar transformCustomerToDTO(Customer c){
        return new CustomerDTOForCar(
                c.getId(),
                c.getName(),
                c.getLastname(),
                c.getSurname()
        );
    }

    //Transformar Car a CarDTO
    public FindCarDTO transformCarToDTO(Car c){
        return new FindCarDTO(
                c.getId(),
                c.getModel(),
                c.getColor(),
                c.getRegisterDate(),
                c.getSaleDate(),
                c.getBasePrice(),
                c.getTotalPrice(),
                c.isOnSale(),
                c.getBrand(),
                c.getCustomer() != null ? transformCustomerToDTO(c.getCustomer()) : null,
                c.getServices() != null ? transformServicesToDTOs(c.getServices()) : null
        );
    }

    //Transformar Service a ServiceDTO
    public List<ServiceCarDTO> transformServicesToDTOs(List<mx.edu.utez.adm.modules.service.Service> s){
        List<ServiceCarDTO> list = new ArrayList<>();
        for(mx.edu.utez.adm.modules.service.Service service : s){
            list.add(new ServiceCarDTO(
                    service.getId(),
                    service.getName(),
                    service.getCode(),
                    service.getDescription()
            ));
        }
        return list;
    }

    public List<FindCarDTO> transformCarsToDTOs(List<Car> cars){
        List<FindCarDTO> list = new ArrayList<>();
        for(Car c : cars){
            list.add(transformCarToDTO(c));
        }
        return list;
    }

    //Traer todos los autos
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll(){
        List<FindCarDTO> list = new ArrayList<>();
        String message = "";
        if(carRepository.findAll().isEmpty()) {
            message = "Aun no hay registros";
        } else {
            message = "Operacion exitosa";
            list = transformCarsToDTOs(carRepository.findAll());
        }
        return customResponseEntity.getOkResponse(message, list);
    }

    //Traer auto por id
    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long id){
        FindCarDTO found = transformCarToDTO(carRepository.findById(id));
        return (found == null)
                ? customResponseEntity.get404Response()
                : customResponseEntity.getOkResponse("Operacion exitosa", found);
    }

    //Guardar carro
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> save(Car car){
        long brandId = car.getBrand().getId();
        String brandName = car.getBrand().getName();
        Brand brand;
        if(brandId==0){
            brand = brandRepository.findByName(brandName);
        }else{
            brand = brandRepository.findById(brandId);
        }

        Date currentDay = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", new Locale("es", "MX"));

        car.setRegisterDate(sdf.format(currentDay));
        car.setOnSale(true);
        car.setTotalPrice(car.getBasePrice());
        if(brand == null){
            brand = new Brand();
            brand.setName(car.getBrand().getName());
            brandRepository.save(brand);
        }

        car.setBrand(brand);
        try{
            carRepository.save(car);
            return customResponseEntity.getOkResponse(
                    "Registro exitoso",
                    null
            );
        }catch (Exception e){
            e.printStackTrace();
            return customResponseEntity.get400Response();
        }
    }

    //Vender carro - Actualizar status, fecha de venta, dueño y precio total
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> sell(CarSaleDTO carSaleDTO){
        Car found = carRepository.findById(carSaleDTO.getId());
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            if(!found.isOnSale()){
                return customResponseEntity.get400Response();
            }
            Date currentDay = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", new Locale("es", "MX"));

            found.setOnSale(false); //REVISAR VALICACIONES
            found.setSaleDate(sdf.format(currentDay));
            found.setTotalPrice(carSaleDTO.getTotalPrice());
            found.setCustomer(customerRepository.findById(carSaleDTO.getCustomer().getId()));
            found.setServices(carSaleDTO.getServices());
            try{
                carRepository.save(found);
                return customResponseEntity.getOkResponse(
                        "Vehiculo registrado como vendido exitosamente",
                        null
                );
            }catch (Exception e){
                return customResponseEntity.get400Response();
            }
        }
    }

    //Actualizar carro
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> update(Car car){
        Car found = carRepository.findById(car.getId());
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            if(!found.isOnSale()){
                return customResponseEntity.get405Response();
            }
            long brandId= car.getBrand().getId();
            Brand brand = brandRepository.findById(brandId);

            if(brand == null){
                brand = new Brand();
                brand.setName(car.getBrand().getName());
                brandRepository.save(brand);
            }

            car.setBrand(brand);

            car.setRegisterDate(found.getRegisterDate());
            car.setOnSale(found.isOnSale());

            try{
                carRepository.save(car);
                return customResponseEntity.getOkResponse(
                        "Actualizacion exitosa",
                        null
                );
            }catch (Exception e){
                return customResponseEntity.get400Response();
            }
        }
    }

    //Eliminar carro
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> deleteById(Car car){
        Car found = carRepository.findById(car.getId());
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            if(!found.isOnSale()){
                return customResponseEntity.get405Response();
            }
            try{
                carRepository.deleteById(car.getId());
                //Eliminar en cascada los servicios
                serviceRepository.deleteByCarId(car.getId());
                return customResponseEntity.getOkResponse(
                        "Eliminacion exitosa",
                        null
                );
            }catch (Exception e){
                return customResponseEntity.get400Response();
            }
        }
    }


}