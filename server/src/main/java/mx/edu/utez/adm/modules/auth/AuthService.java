package mx.edu.utez.adm.modules.auth;

import jakarta.transaction.Transactional;
import mx.edu.utez.adm.modules.auth.DTO.AuthLoginDTO;
import mx.edu.utez.adm.modules.employee.Employee;
import mx.edu.utez.adm.modules.employee.EmployeeRepository;
import mx.edu.utez.adm.utils.CustomResponseEntity;
import mx.edu.utez.adm.utils.security.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

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
    }


}
