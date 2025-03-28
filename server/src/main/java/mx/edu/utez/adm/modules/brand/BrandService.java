package mx.edu.utez.adm.modules.brand;

import mx.edu.utez.adm.modules.employee.DTO.EmployeeDTO;
import mx.edu.utez.adm.modules.employee.Employee;
import mx.edu.utez.adm.utils.CustomResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class BrandService {
    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    //Traer todas las marcas
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll(){
        List<Brand> list = new ArrayList<>();
        String message = "";
        if(brandRepository.findAll().isEmpty()) {
            message = "Aun no hay registros";
        } else {
            message = "Operacion exitosa";
            for(Brand b : brandRepository.findAll()){
                list.add(b);
            }
        }
        return customResponseEntity.getOkResponse(message, list);
    }

    //Traer marca por id
    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long id){
        Brand found = brandRepository.findById(id);
        return (found == null)
                ? customResponseEntity.get404Response()
                : customResponseEntity.getOkResponse("Operacion exitosa", found);
    }

    //Guardar marca
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> save(Brand brand){
        try{
            brand.setStatus(true);
            brandRepository.save(brand);
            return customResponseEntity.getOkResponse(
                    "Registro exitoso",
                    Map.of("id", brand.getId())
            );
        }catch (Exception e){
            return customResponseEntity.get400Response();
        }
    }

    //Actualizar marca
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> update(Brand brand){
        Brand found = brandRepository.findById(brand.getId());
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            try{
                brand.setStatus(found.isStatus());
                brandRepository.save(brand);
                return customResponseEntity.getOkResponse(
                        "Actualizacion exitosa",
                        null
                );
            }catch (Exception e){
                return customResponseEntity.get400Response();
            }
        }
    }

    //Eliminar marca
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> deleteById(Brand brand){
        Brand found = brandRepository.findById(brand.getId());
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            try{
                brandRepository.deleteById(brand.getId());
                return customResponseEntity.getOkResponse(
                        "Eliminacion exitosa",
                        null
                );
            }catch (Exception e){
                return customResponseEntity.get400Response();
            }
        }
    }

    //Cambiar estado de una marca
    @Transactional(rollbackFor = {Exception.class, SQLException.class})
    public ResponseEntity<?> changeStatus(Brand brand){
        Brand found = brandRepository.findById(brand.getId());
        if(found == null){
            return customResponseEntity.get404Response();
        }else{
            try{
                found.setStatus(brand.isStatus());
                brandRepository.changeStatus(found.getId(), found.isStatus());
                return customResponseEntity.getOkResponse(
                        "Actualizacion de estado exitosa",
                        null
                );
            }catch (Exception e){
                return customResponseEntity.get400Response();
            }
        }
    }

    //Traer marcas activas
    @Transactional(readOnly = true)
    public ResponseEntity<?> findAllActive(){
        List<Brand> list = new ArrayList<>();
        String message = "";
        if(brandRepository.findAllActive().isEmpty()) {
            message = "Aun no hay registros";
        } else {
            message = "Operacion exitosa";
            for(Brand b : brandRepository.findAllActive()){
                list.add(b);
            }
        }
        return customResponseEntity.getOkResponse(message, list);
    }


}
