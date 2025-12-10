package Project_maker.finance_insight.csv_upload;

import Project_maker.finance_insight.Authorisation.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/csv")
@CrossOrigin(origins = "http://localhost:3000")
public class CSVController {

    private final CSVService csvService;
    private final JwtService jwtService;

    public CSVController(CSVService csvService, JwtService jwtService) {
        this.csvService = csvService;
        this.jwtService = jwtService;
    }

    // Extract email from Authorization Bearer token
    private String extractEmail(String authHeader) {
        String token = authHeader.replace("Bearer ", "").trim();
        return jwtService.extractEmail(token);
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadCSV(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            // 1️⃣ Validate file exists
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Uploaded file is empty");
            }

            // 2️⃣ Validate CSV type
            if (!file.getOriginalFilename().endsWith(".csv")) {
                return ResponseEntity.badRequest().body("Error: Only CSV files allowed");
            }

            // 3️⃣ Get user email from token
            String userEmail = extractEmail(token);

            // 4️⃣ Process file
            csvService.processCSV(file, userEmail);

            return ResponseEntity.ok("CSV uploaded & expenses saved successfully!");

        } catch (Exception e) {
            e.printStackTrace(); // For debugging purpose

            return ResponseEntity
                    .status(500)
                    .body("Failed to process CSV: " + e.getMessage());
        }
    }
}
