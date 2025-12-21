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

    // ------------------- SAVE -------------------
    @PostMapping("/set")
    public ResponseEntity<?> setBudget(
            Principal principal,
            @RequestBody BudgetRequest request) {

        String email = principal.getName();

        budgetService.setMonthlyBudget(
                email,
                request.getYear(),
                request.getMonth(),
                request.getAmount()
        );

        return ResponseEntity.ok(Map.of("message", "Budget Saved Successfully"));
    }

    // ------------------- STATUS -------------------
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
                "totalBudget", budget,
                "remaining", budget - spent
        ));
    }

    // ------------------- CURRENT -------------------
    @GetMapping("/current")
    public ResponseEntity<?> currentMonth(Principal principal) {

        String email = principal.getName();
        LocalDate today = LocalDate.now();

        double budget = budgetService.getBudget(email, today.getYear(), today.getMonthValue());
        double spent = budgetService.getMonthlySpent(email, today.getYear(), today.getMonthValue());

        return ResponseEntity.ok(Map.of(
                "totalBudget", budget,
                "totalSpent", spent,
                "remaining", budget - spent
        ));
    }

    // ------------------- UPDATE -------------------
    @PutMapping("/update")
    public ResponseEntity<?> update(
            Principal principal,
            @RequestBody BudgetRequest request) {

        budgetService.updateMonthlyBudget(
                principal.getName(),
                request.getYear(),
                request.getMonth(),
                request.getAmount()
        );

        return ResponseEntity.ok(Map.of("message", "Updated Successfully"));
    }

    // ------------------- DELETE -------------------
    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(
            Principal principal,
            @RequestParam int year,
            @RequestParam int month) {

        budgetService.deleteBudget(principal.getName(), year, month);
        return ResponseEntity.ok(Map.of("message", "Deleted Successfully"));
    }
}
