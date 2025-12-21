package Project_maker.finance_insight.Budget_model;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    // ------------------- SAVE BUDGET --------------------
    @PostMapping("/set")
    public ResponseEntity<?> setBudget(
            Principal principal,
            @RequestBody BudgetRequest requestBody) {

        String email = principal.getName();

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
            Principal principal,
            @RequestParam int year,
            @RequestParam int month) {

        String email = principal.getName();

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
            Principal principal,
            @RequestBody BudgetRequest requestBody) {

        String email = principal.getName();

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
    public ResponseEntity<?> getCurrentMonthBudget(Principal principal) {

        String email = principal.getName();
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
            Principal principal,
            @RequestParam int year,
            @RequestParam int month) {

        String email = principal.getName();

        budgetService.deleteBudget(email, year, month);

        return ResponseEntity.ok(Map.of("message", "Budget Deleted Successfully"));
    }
}
