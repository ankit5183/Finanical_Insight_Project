package Project_maker.finance_insight.user_model;

import Project_maker.finance_insight.Authorisation.JwtService;
import Project_maker.finance_insight.Authorisation.LoginResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserController(UserService userService,
                          JwtService jwtService,
                          BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    // --- REGISTER ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLogin loginReq) {

        User user = userService.findByEmail(loginReq.getEmail());

        if (user == null || !passwordEncoder.matches(
                loginReq.getPassword(), user.getPassword())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        }

        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(new LoginResponse(token, "Login successful"));
    }

    // --- PROTECTED ---
    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(
                Map.of("message", "Hello " + email + ", welcome to your dashboard")
        );
    }
}
