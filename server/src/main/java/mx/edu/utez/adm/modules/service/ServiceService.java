package mx.edu.utez.adm.modules.service;

import mx.edu.utez.adm.utils.CustomResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    @Transactional(readOnly = true)
    public ResponseEntity<?> findAll(){
        List<mx.edu.utez.adm.modules.service.Service> list = serviceRepository.findAll();
        return list.isEmpty()
                ? customResponseEntity.get404Response()
                : customResponseEntity.getOkResponse("Operación exitosa", list);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<?> findById(long id){
        mx.edu.utez.adm.modules.service.Service found = serviceRepository.findById(id).orElse(null);
        return found == null
                ? customResponseEntity.get404Response()
                : customResponseEntity.getOkResponse("Operación exitosa", found);
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> save(mx.edu.utez.adm.modules.service.Service service){
        try {
            service.setStatus(true);
            serviceRepository.save(service);
            return customResponseEntity.get201Response("Operación exitosa");
        } catch (Exception e) {
            return customResponseEntity.get400Response();
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<?> update(mx.edu.utez.adm.modules.service.Service service, long id){
        if (serviceRepository.findById(id).isPresent()) {
            service.setId(id);
            try {
                mx.edu.utez.adm.modules.service.Service updated = serviceRepository.save(service);
                return customResponseEntity.getOkResponse("Actualización exitosa", updated);
            } catch (Exception e) {
                return customResponseEntity.get400Response();
            }
        } else {
            return customResponseEntity.get404Response();
        }
    }


}
