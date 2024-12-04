package mx.edu.utez.adm.modules.auth;

import mx.edu.utez.adm.modules.auth.DTO.AuthLoginDTO;
import mx.edu.utez.adm.modules.employee.Employee;
import mx.edu.utez.adm.modules.employee.EmployeeRepository;
import mx.edu.utez.adm.utils.CustomResponseEntity;
import mx.edu.utez.adm.utils.security.JWTUtil;
import mx.edu.utez.adm.utils.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CustomResponseEntity customResponseEntity;

    @Autowired
    private JWTUtil jwtUtil;

    @Transactional(readOnly = true)
    public ResponseEntity<?> login(AuthLoginDTO authLoginDTO) {
        Employee found = employeeRepository.findByPasswordAndEmailOrUsername(
                authLoginDTO.getPassword(),
                authLoginDTO.getUsername()
        );
        if (found == null) {
            return customResponseEntity.get404Response();
        } else {
            try {
                UserDetails userDetails = new UserDetailsImpl(found);
                String token = jwtUtil.generateToken(userDetails);
                int roleId = found.getRole().getId();
                long employeeId = found.getId();

                Map<String, Object> responseData = new HashMap<>();
                responseData.put("token", token);
                responseData.put("roleId", roleId);
                responseData.put("employeeId", employeeId);
                return customResponseEntity.getOkResponse(
                        "Inicio de sesión exitoso",
                        responseData
                );
            } catch (Exception e) {
                System.out.println(e.getMessage());
                e.printStackTrace();
                return customResponseEntity.get400Response();
            }
        }
    }

}
