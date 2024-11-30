package mx.edu.utez.adm.modules.car;

import mx.edu.utez.adm.modules.brand.Brand;
import mx.edu.utez.adm.modules.brand.BrandRepository;
import mx.edu.utez.adm.modules.car.DTO.CarSaleDTO;
import mx.edu.utez.adm.modules.customer.CustomerRepository;
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

    //Traer todos los autos
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll(){
        List<Car> list = new ArrayList<>();
        String message = "";
        if(carRepository.findAll().isEmpty()) {
            message = "Aun no hay registros";
        } else {
            message = "Operacion exitosa";
            for(Car c :carRepository.findAll()){
                list.add(c);
            }
        }
        return customResponseEntity.getOkResponse(message, list);
    }

    //Traer auto por id
    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long id){
        Car found = carRepository.findById(id);
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
            Date currentDay = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", new Locale("es", "MX"));

            found.setOnSale(false);
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
            long brandId= car.getBrand().getId();
            Brand brand = brandRepository.findById(brandId);

            if(brand == null){
                brand = new Brand();
                brand.setName(car.getBrand().getName());
                brandRepository.save(brand);
            }

            car.setBrand(brand);

            car.setRegisterDate(found.getRegisterDate());

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
            try{
                carRepository.deleteById(car.getId());
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