package mx.edu.utez.adm.modules.car;

import mx.edu.utez.adm.modules.brand.Brand;
import mx.edu.utez.adm.modules.brand.BrandRepository;
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
        Brand brand = brandRepository.findById(brandId);

        Date currentDay = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", new Locale("es", "MX"));

        car.setRegisterDate(sdf.format(currentDay));
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
            return customResponseEntity.get400Response();
        }
    }

    //Actualizar carro
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> update(Car car){
        Brand found = brandRepository.findById(car.getId());
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
        Brand found = brandRepository.findById(car.getId());
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            try{
                brandRepository.deleteById(car.getId());
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