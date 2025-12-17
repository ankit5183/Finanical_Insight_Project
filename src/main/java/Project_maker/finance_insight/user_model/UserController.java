package Project_maker.finance_insight.user_model;

import Project_maker.finance_insight.Authorisation.JwtService;
import Project_maker.finance_insight.Authorisation.LoginResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    // Use constructor injection for all dependencies (best practice)
    public UserController(UserService userService, JwtService jwtService, BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    // --- REGISTER ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User Registered Successfully");
        } catch (RuntimeException e) {
            // This catches "Email already in use" or Database connection errors
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLogin loginReq) {
        try {
            User user = userService.findByEmail(loginReq.getEmail());

            // Check if user exists and password matches hashed password in DB
            if (user == null || !passwordEncoder.matches(loginReq.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
            }

            String token = jwtService.generateToken(user.getEmail());
            return ResponseEntity.ok(new LoginResponse(token, "Login successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed due to server error");
        }
    }

    // --- PROTECTED DASHBOARD ---
    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard(@RequestHeader("Authorization") String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
            }
            
            String jwt = token.substring(7); // Cleaner way to remove "Bearer "
            String email = jwtService.extractEmail(jwt);
            return ResponseEntity.ok("Hello " + email + ", Welcome to your dashboard!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid Token");
        }
    }
}
