package Project_maker.finance_insight.csv_upload;

import Project_maker.finance_insight.Authorisation.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/csv")
public class CSVController {

    private final CSVService csvService;

    public CSVController(CSVService csvService) {
        this.csvService = csvService;
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadCSV(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            // 1️⃣ Validate file
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Uploaded file is empty");
            }

            // 2️⃣ Validate CSV
            if (file.getOriginalFilename() == null ||
                !file.getOriginalFilename().toLowerCase().endsWith(".csv")) {
                return ResponseEntity.badRequest().body("Error: Only CSV files allowed");
            }

            // 3️⃣ Get authenticated user email
            String userEmail = authentication.getName();

            // 4️⃣ Process CSV
            csvService.processCSV(file, userEmail);

            return ResponseEntity.ok("CSV uploaded & expenses saved successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body("Failed to process CSV: " + e.getMessage());
        }
    }
}
