package Project_maker.finance_insight.user_model;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Fetch the user from the database
        User user = userRepository.findByEmail(email);

        // 2. Check if user exists
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        // 3. Map our User entity to Spring Security's UserDetails
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles("USER") // Internally creates GrantedAuthority "ROLE_USER"
                .build();
    }
}
