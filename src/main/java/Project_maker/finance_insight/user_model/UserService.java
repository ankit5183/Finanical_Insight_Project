package Project_maker.finance_insight.user_model;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

     public User registerUser(User user) {
    if (userRepository.findByEmail(user.getEmail()) != null) {
        throw new RuntimeException("Email already in use");
    }
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
}

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
