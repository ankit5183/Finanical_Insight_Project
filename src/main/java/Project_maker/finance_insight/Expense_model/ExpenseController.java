package Project_maker.finance_insight.Expense_model;

import Project_maker.finance_insight.Authorisation.JwtService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expense")
public class ExpenseController {

    private final ExpenseService service;
    private final JwtService jwtService;

    public ExpenseController(ExpenseService service, JwtService jwtService) {
        this.service = service;
        this.jwtService = jwtService;
    }

    // Extract email from JWT token
    private String extractEmail(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtService.extractEmail(token);
    }

    @PostMapping("/add")
    public Expense addExpense(
            @RequestHeader("Authorization") String token,
            @RequestBody Expense expense) {

        String email = extractEmail(token);
        expense.setUserEmail(email);
        return service.addExpense(expense);
    }

    @GetMapping("/all")
    public List<Expense> allExpenses(@RequestHeader("Authorization") String token) {
        return service.getExpenses(extractEmail(token));
    }

    @GetMapping("/monthly")
    public List<Expense> monthly(
            @RequestHeader("Authorization") String token,
            @RequestParam int year,
            @RequestParam int month) {

        return service.getMonthlyExpense(extractEmail(token), year, month);
    }

    // 🔹 NEW TOTAL EXPENSE API
    @GetMapping("/total")
    public double totalExpense(@RequestHeader("Authorization") String token) {
        String email = extractEmail(token);
        return service.getTotalExpense(email);
    }

    // Weekly Expense
    @GetMapping("/weekly")
    public List<Expense> weeklyExpense(
            @RequestHeader("Authorization") String token,
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam int day) {

        String email = extractEmail(token);
        LocalDate date = LocalDate.of(year, month, day);

        return service.getWeeklyExpense(email, date);
    }

    // Weekly Total
    @GetMapping("/weekly/total")
    public double weeklyTotal(
            @RequestHeader("Authorization") String token,
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam int day) {

        String email = extractEmail(token);
        LocalDate date = LocalDate.of(year, month, day);

        return service.getWeeklyTotal(email, date);
    }

    // Category wise summary
    @GetMapping("/category-summary")
    public Map<String, Double> categorySummary(
            @RequestHeader("Authorization") String token) {

        return service.getCategorySummary(extractEmail(token));
    }
      @DeleteMapping("/bulk-delete")
    public ResponseEntity<?> deleteMultipleExpenses(
            @RequestBody List<Long> expenseIds,
            Principal principal) {

        expenseService.deleteMultipleExpenses(
                principal.getName(),
                expenseIds
        );

        return ResponseEntity.ok("Expenses deleted successfully");
    }
}
