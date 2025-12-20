package Project_maker.finance_insight.Budget_model;

import Project_maker.finance_insight.Authorisation.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    private final BudgetService budgetService;
    private final JwtService jwtService;

    public BudgetController(BudgetService budgetService, JwtService jwtService) {
        this.budgetService = budgetService;
        this.jwtService = jwtService;
    }

    private String extractEmail(String token) {
        return jwtService.extractEmail(token.replace("Bearer ", ""));
    }

    // ------------------- SAVE BUDGET --------------------
    @PostMapping("/set")
    public ResponseEntity<?> setBudget(
            @RequestHeader("Authorization") String token,
            @RequestBody BudgetRequest requestBody) {

        String email = extractEmail(token);

        budgetService.setMonthlyBudget(
                email,
                requestBody.getYear(),
                requestBody.getMonth(),
                requestBody.getAmount()
        );

        return ResponseEntity.ok(Map.of("message", "Budget Saved Successfully"));
    }

    // ------------------- GET STATUS ---------------------
    @GetMapping("/status")
    public ResponseEntity<?> getStatus(
            @RequestHeader("Authorization") String token,
            @RequestParam int year,
            @RequestParam int month) {

        String email = extractEmail(token);

        double spent = budgetService.getMonthlySpent(email, year, month);
        double budget = budgetService.getBudget(email, year, month);

        return ResponseEntity.ok(Map.of(
                "spent", spent,
                "budgetAmount", budget,
                "remaining", budget - spent
        ));
    }

    // ------------------- UPDATE BUDGET ------------------
    @PutMapping("/update")
    public ResponseEntity<?> updateBudget(
            @RequestHeader("Authorization") String token,
            @RequestBody BudgetRequest requestBody) {

        String email = extractEmail(token);

        budgetService.updateMonthlyBudget(
                email,
                requestBody.getYear(),
                requestBody.getMonth(),
                requestBody.getAmount()
        );

        return ResponseEntity.ok(Map.of("message", "Budget Updated Successfully"));
    }

    // ------------------- CURRENT MONTH ------------------
    @GetMapping("/current")
    public ResponseEntity<?> getCurrentMonthBudget(
            @RequestHeader("Authorization") String token) {

        String email = extractEmail(token);

        LocalDate today = LocalDate.now();

        double totalBudget = budgetService.getBudget(
                email, today.getYear(), today.getMonthValue()
        );
        double totalSpent = budgetService.getMonthlySpent(
                email, today.getYear(), today.getMonthValue()
        );

        return ResponseEntity.ok(Map.of(
                "totalBudget", totalBudget,
                "totalSpent", totalSpent,
                "remaining", totalBudget - totalSpent
        ));
    }

    // ------------------- DELETE BUDGET ------------------
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteBudget(
            @RequestHeader("Authorization") String token,
            @RequestParam int year,
            @RequestParam int month) {

        String email = extractEmail(token);

        budgetService.deleteBudget(email, year, month);

        return ResponseEntity.ok(Map.of("message", "Budget Deleted Successfully"));
    }
}
