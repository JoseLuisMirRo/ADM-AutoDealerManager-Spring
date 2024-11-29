package mx.edu.utez.adm.utils.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import utez.edu.mx.gestionProyectos.modules.employee.Employee;
import utez.edu.mx.gestionProyectos.modules.employee.EmployeeRepository;

import java.util.Collections;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {
    @Autowired
    private EmployeeRepository employeeRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Employee employee = employeeRepository.findByUsername(username);
    if (employee == null) {
        throw new UsernameNotFoundException("user not found: " + username);
    }

    GrantedAuthority authority = new SimpleGrantedAuthority(employee.getRol().getName());

    return new org.springframework.security.core.userdetails.User(employee.getUsername(), employee.getPassword(),
            Collections.singleton(authority));

    }
}
